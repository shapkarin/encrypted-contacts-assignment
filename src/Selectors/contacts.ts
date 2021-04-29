// TODO
import { createSelector } from 'reselect'

export const getCurrentContact = createSelector(
  [contacts => contacts.collection, contacts => contacts.current],
  (contacts, id) => contacts[id]
);

export const find = (value) => createSelector(
  contacts => contacts,
  (contacts) => {
    const found = contacts.filter(contact =>
      Object.values(contact).join(' ').toLocaleLowerCase().includes(value.toLocaleLowerCase())
    )
    return found;
  }
);
