const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const global_salt = 'aa77f7c2b195d775597223bb54e6ecfe';
const key = password => crypto.pbkdf2Sync(password, global_salt, 100, 32, 'sha512');

const encrypt = (text, password) => {

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key(password), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (hash, password) => {

    const decipher = crypto.createDecipheriv(algorithm, key(password), Buffer.from(hash.iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

const scrypt = {
  create: async (password) => (
    new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString("hex")

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
          if (err) reject(err);
          resolve(salt + ":" + derivedKey.toString('hex'))
      });
    })
  ),
  verify: async (password, hash) => (
    new Promise((resolve, reject) => {
        const [ salt, key ] = hash.split(":")
         const keyBuffer = Buffer.from(key, 'hex')
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(crypto.timingSafeEqual(keyBuffer, derivedKey))
        });
    })
  )
}


module.exports = {
    encrypt,
    decrypt,
    scrypt
};
