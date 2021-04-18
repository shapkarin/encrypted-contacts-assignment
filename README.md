Hello.

To protect contacts more I decide to store all contacts fields and it's data in encypted format, so there will be harder to get for example the phone that contains only the digits. At the first version password sends to the server with the httpOnly cookies because I decided to not store the password at the backend's runtime or database.

This app can be grow in web service. The currently for that needed:
- add users and sessions, separate contacts by users
- add HMAC because the data now goes throw the https and the global network
- ? also maybe it's a good idea to encrypt the data at the client side and send throw the network only the encrypted version

