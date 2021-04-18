import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import App from '../App';
import { encrypt, decrypt } from '../server/crypto';
import { create, update, remove } from '../Actions';

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });

  const data = 'Some data';
  const hash = encrypt(data);

  it('should encrypt the data', () => {
    const hash = encrypt(data);

    expect(data).not.toBe(hash.content)
  });

  it('should decrypt the data', () => {
    const decrypted = decrypt(hash);

    expect(data).toBe(decrypted);
  });

  // it('should to create a new contact', () => {
  // });

  // it('should to edit a contact', () => {
  // });

  // it('should to delete a contact', () => {
  // });

});
