import { createSelector } from 'reselect'

export const getCurrentContact = createSelector(
  [contacts => contacts.collection, contacts => contacts.current],
  (contacts, id) => {
    return contacts[id];
  }
);
