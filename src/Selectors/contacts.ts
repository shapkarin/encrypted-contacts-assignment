// todo

import { createSelector } from 'reselect'

export const getCurrentContact = createSelector(
  [contacts => contacts.collection, contacts => contacts.current],
  (contacts, id) => contacts[id]
);

export const find = (field, value) => createSelector(
  contacts => contacts,
  (contacts) => contacts.find(contact => contact[field].includes(value))
);
