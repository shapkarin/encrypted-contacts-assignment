const mongoose = require('mongoose');
const express = require('express');
const session = require('cookie-session');
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const userScheme = new Schema({ hash: String });
const contactsScheme = new Schema({ hash: String });
const User = mongoose.model('User', userScheme);
const Contacts = mongoose.model('Contacts', contactsScheme);
const { encrypt, decrypt } = require('./crypto');

app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/db', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  // useFindAndModify: false
}, function(err){
    if(err) return console.log(err);
    app.listen(3000);
});

app.get('/api/contacts', function(req, res) {

    const { cookies: { password } } = req;

    if(!password) return res.sendStatus(400);

    Contacts.find({}, function(err, contacts) {
      if(err) return console.log(err);

      const decrypted = contacts.map(contact => decrypt(contact, password));

      res.send(decrypted);
    });
});

app.get('/api/contacts/:id', function(req, res) {

    const { params: { id }, cookies: { password } } = req;

    if(!id && !password) return res.sendStatus(400);

    Contacts.findOne({_id: id}, function(err, contact) {
      if(err) return console.log(err);

      const decrypted = decrypt(contact, password);

      res.send(decrypted);
    });
});

app.post('/api/contacts', jsonParser, function (req, res) {

    const { body: contact, cookies: { password } } = req;

    if(!contact && !password) return res.sendStatus(400);

    const hash = encrypt(JSON.stringify(contact), password);
    const contact = new Contacts({ hash });

    contact.save(function(err) {
      if(err) return console.log(err);
      res.send(contact);
    });
});

app.delete('/api/contacts/:id', function(req, res){

    const { params: { id } } = req;

    if(!id) return res.sendStatus(400);

    Contacts.findByIdAndDelete(id, function(err, contact) {
      if(err) return console.log(err);
      res.sendStatus(200);
    });
});

app.put('/api/contacts/:id', jsonParser, function(req, res) {

    const { body: contact, params: { id }, cookies: { password } } = req;

    if(!body && !id && !password) return res.sendStatus(400);

    const hash = encrypt(contact, password);

    Contacts.findOneAndUpdate({_id: id}, { hash }, function(err, user){
      if(err) return console.log(err);
      res.send(body);
    });
});

app.post('/api/checkPassword', function(req, res){

  const { body: password } = req;

  if(!password) return res.sendStatus(400);

  const hash = encrypt(password);

  User.findOne({ hash }, function(err, user){
    if(err) return console.log(err);
    res
        .cookie('password', password, {
          maxAge: 900000, // ?
          secure: true,
          httpOnly: true,
          // signed: true,
        })
        .sendStatus(200);
  });
});

app.post('/api/createaUser', function(req, res){

    const { body: password } = req;

    if(!password) return res.sendStatus(400);

    const hash = encrypt(JSON.stringify(password));
    const user = new User({ hash });

    user.save(function(err){
      if(err) return console.log(err);
      res
        .cookie('password', password, {
          maxAge: 900000, // ?
          secure: true,
          httpOnly: true,
        })
        .sendStatus(201);
    });
});
