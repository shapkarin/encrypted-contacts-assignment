import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import App from '../App';
import { encrypt, decrypt, scrypt } from '../server/crypto';
import { create, update, remove } from '../Actions';

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });

  const data = 'Some data';
  const hash = encrypt(data);
  const decrypted = decrypt(hash);

  it('should encrypt the data', () => {
    expect(data).not.toBe(hash.content)
  });

  it('should decrypt the data', () => {
    expect(data).toBe(decrypted);
  });

  const password = '1234567890';

  it('should create a password hash with scrypt that not equals the input', async () => {
    const scrypt_hash = await scrypt.create(password);
    expect(password).not.toBe(scrypt_hash)
  });

  it('should verify the password with hash', async () => {
    const scrypt_hash = await scrypt.create(password);
    const isFound = await scrypt.verify(password, scrypt_hash);

    expect(isFound).toBe(true);
  });

});
