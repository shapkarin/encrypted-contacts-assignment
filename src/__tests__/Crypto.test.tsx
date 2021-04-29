import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { encrypt, decrypt, scrypt } from '../server/crypto';
import { create, update, remove } from '../Actions';

describe('Test crypto module', () => {
  const data = 'Some data';
  const pass = '1234567890';
  const hash = encrypt(data, pass);
  const decrypted = decrypt(hash, pass);

  it('should encrypt the data', () => {
    expect(data).not.toBe(hash.content)
  });

  it('should decrypt the data', () => {
    expect(data).toBe(decrypted);
  });

  const password = '1234567890';

  it('should create a password hash with scrypt that not equals the input', async () => {
    const scrypt_hash = await scrypt.create(password);
    expect(password).not.toBe(scrypt_hash);
  });

  it('should verify the password with hash', async () => {
    const scrypt_hash = await scrypt.create(password);
    const isFound = await scrypt.verify(password, scrypt_hash);

    expect(isFound).toBe(true);
  });

});
