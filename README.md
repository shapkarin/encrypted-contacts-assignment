Install: 
```sh
yarn install
```

Start the app:
You need to generate sertificates and place it to the `./sslcert` folder to make an app works well. Please follow the https://letsencrypt.org/ru/docs/certificates-for-localhost/
```sh
npm run start:renderer
# or
yarn start:renderer
# or
npm start
```

- Password is not sotred anywhere like a string, only at httpOnly cookie while a session
- To verify a user with users db it used node.js crypto.scrypt
- To encrypt and decrypt the contacts it used aes-256-ctr and the password from the httpOnly cookie, iv and global_salt
- To store to the contacts and users it used database (nedb)
- To manipulate the data it used node express server and CRUD API
- Tests are at `src/__tests__/App.test.tsx`;

To protect contacts more I decide to store all contacts fields and it's data in encypted format, so there will be harder to get for example the phone that contains only the digits.


This app can be grow in web service. The currently for that needed:
- separate contacts by users
- add HMAC because the data now goes throw the https and the global network

Should to be added:
- Types
- More tests
- Styles
- Edit the contact (redux and API endpoint are ready, UI needs to be added)
