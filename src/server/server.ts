export default function() {
  const express = require('express');
  const Datastore = require('nedb');
  const https = require('https');
  const app = express();
  const cookieParser = require('cookie-parser')
  const jsonParser = express.json();
  const fs = require('fs');
  const bodyParser = require('body-parser')
  const { promisify } = require('util');

  const { encrypt, decrypt } = require('./crypto');

  const User = new Datastore({
    filename: '../../user.db',
    autoload: true,
    timestampData: true,
  });
  const Contacts = new Datastore({
    filename: '../../contacts.db',
    autoload: true,
    timestampData: true,
  });

  var key  = fs.readFileSync('sslcert/localhost.key', 'utf8');
  var cert = fs.readFileSync('sslcert/localhost.crt', 'utf8');

  app.use(express.static(__dirname + '/public'));
  app.use(cookieParser());
  app.use(bodyParser.json());

  var httpsServer = https.createServer({ key, cert }, app);

  app.get('/api/contacts', async function(req, res) {

      const { cookies: { password } } = req;

      if(!password) return res.sendStatus(400);

      try {
        const contacts = await Contacts.asyncFind({})
        const decrypted = contacts.map(contact => decrypt(contact, password));

        res.send(decrypted);
      } catch(err) {
        console.log(err);
        res.sendStatus(500);
      }
  });

  app.get('/api/contacts/:id', async function(req, res) {

      const { params: { id }, cookies: { password } } = req;

      if(!id && !password) return res.sendStatus(400);

      try {
        const contact = await Contacts.asyncFindOne({_id: id});
        const decrypted = decrypt(contact, password);

        res.send(decrypted);
      } catch(err) {
        console.log(err);
      }
  });

  app.post('/api/contacts', jsonParser, async function (req, res) {

      const { body: { contact }, cookies: { password } } = req;

      if(!contact && !password) return res.sendStatus(400);

      try {
        const hash = encrypt(JSON.stringify(contact), password);

        await Contacts.asyncInsert({ hash });
        res.send(contact);
      } catch(err) {
        console.log(err);
      }
  });

  app.delete('/api/contacts/:id', async function(req, res){

      const { params: { id } } = req;

      if(!id) return res.sendStatus(400);

      try {
        await Contacts.remove({ _id: id })
        res.sendStatus(200);
      } catch(err) {
        console.log(err);
        res.sendStatus(404);
      }
  });

  app.put('/api/contacts/:id', jsonParser, async function(req, res) {

      const { body: { contact }, params: { id }, cookies: { password } } = req;

      if(!body && !id && !password) return res.sendStatus(400);

      try {
        const hash = encrypt(contact, password);

        await Contacts.update({_id: id}, { hash });
        res.send(body);
      } catch(err) {
        console.log(err);
      }
  });

  app.post('/api/user', async function(req, res){

      const { body: { password } } = req;

      if(!password) return res.sendStatus(400);

      try {
        const hash = encrypt(password);

        await User.insert({ hash });
        res
          .cookie('password', password,
            {
              maxAge: 900000, // ?
              secure: true,
              httpOnly: true,
              // signed: true,
          })
          .sendStatus(201);
      } catch(err) {
        console.log(err);
      }
  });

  app.get('/api/user', async function(req, res){

    const { body: { password } } = req;

    if(!password) return res.sendStatus(400);

    try {
      const hash = encrypt(password);

      await User.findOne({ hash });
      res
        .cookie('password', password, {
          maxAge: 900000,
          secure: true,
          httpOnly: true,
        })
        .sendStatus(200);
    } catch(err) {
      console.log(err);
    }

  });

  // for the first version
  app.get('/api/user/exist', function(req, res){

    User.count({}, function (err, count) {

      if(count > 0) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    });
  });

  httpsServer.listen(3042);
};
