import express from 'express';
import Datastore from 'nedb';
import https from 'https';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import bodyParser from 'body-parser';
import path from 'path';

import { encrypt, decrypt, scrypt } from './crypto';

export default function() {
  const app = express();

  const User = new Datastore({
    filename: path.join(__dirname, '../../db/user.db'),
    autoload: true,
  });
  const Contacts = new Datastore({
    filename: path.join(__dirname, '../../db/contacts.db'),
    autoload: true,
  });

  var key  = fs.readFileSync('sslcert/localhost.key', 'utf8');
  var cert = fs.readFileSync('sslcert/localhost.crt', 'utf8');

  app.use(express.static(__dirname + '/public'));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  var httpsServer = https.createServer({ key, cert }, app);

  const cryptoObj = (input, method, password) => {
    const output = {}
    for (const [key, value] of Object.entries(input)) {
      if(key !== '_id' && key !== 'id') {
        output[key] = method(value, password);
      }
    }
    return output
  }

  app.get('/api/contacts', function(req, res) {

      const { cookies: { password } } = req;

      if(!password) return res.sendStatus(400);

      Contacts.find({}, function (err, contacts) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }

        const decrypted = contacts.map((contact) => ({
          id: contact._id,
          ...cryptoObj(contact, decrypt, password),
        }));

        res.send(decrypted);
      });
  });

  app.get('/api/contact/:id', function(req, res) {

      const { params: { id }, cookies: { password } } = req;

      if(!id && !password) return res.sendStatus(400);

      Contacts.findOne({_id: id}, function (err, doc) {
        if (err) console.log(err);

        res.send({
          ...JSON.parse(cryptoObj(doc, decrypt, password)),
          id: _id,
        });
      });
  });

  app.post('/api/contacts', function (req, res) {

      const { body: { contact }, cookies: { password } } = req;

      if(!contact && !password) return res.sendStatus(400);

      Contacts.insert(cryptoObj(contact, encrypt, password), function (err, { _id }) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }
        res.send({ ...contact, id: _id });
      });

  });

  app.delete('/api/contacts/:id',  function(req, res){

      const { params: { id } } = req;

      if(!id) return res.sendStatus(400);

      Contacts.remove({ _id: id }, {}, function(err){
        if (err) console.log(err);

        Contacts.persistence.compactDatafile();

        res.sendStatus(200);
      });
  });

  app.put('/api/contacts/:id', function(req, res) {

      const { body: { contact }, params: { id }, cookies: { password } } = req;

      if(!contact && !id && !password) return res.sendStatus(400);

      Contacts.update({_id: id}, cryptoObj(contact, encrypt, password), {}, function(err){
        if (err) console.log(err);

        res.send(contact);
      });
  });

  // not possible beacuse each valie has uniq iv
  // app.get('/api/contacts/search', function(req, res){
  //   const { cookies: { password }, query: { field, value } } = req;

  //   Contacts.findOne({ [`${field}.content`]: encrypt(value, password).content }, function (err, contact) {
  //     console.log(contact);
  //   });
  // });

  app.post('/api/user', async function(req, res){

      const { body: { password } } = req;

      if(!password) return res.sendStatus(400);

      const hash = await scrypt.create(password);

      User.insert({ hash }, function (err) {
        if (err) {
          console.log(err);
        } else {
          res
            .cookie('password', password,
              {
                maxAge: 900000,
                secure: true,
                httpOnly: true,
                // signed: true,
            })
            .sendStatus(201);
        }
      });
  });

  app.post('/api/user/auth', function(req, res){

    const { body: { password } } = req;

    if(!password) return res.sendStatus(400);

    // not sure about that approach, but currently app has only one user because of it's UI
    User.find({}, async function (err, users) {
      for (let { hash } of users) {
        const verified = await scrypt.verify(password, hash);
          if(verified) {
            res
              .cookie('password', password, {
                maxAge: 900000,
                secure: true,
                httpOnly: true,
              })
              .sendStatus(200);
            break;
          } else if(hash === users[users.length - 1].hash) {
            res.sendStatus(404);
          }
      }
    })
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
