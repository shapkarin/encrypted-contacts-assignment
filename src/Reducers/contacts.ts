import { handleActions } from 'redux-actions';
import { normalize, schema } from 'normalizr';

import { actions } from '../Actions/contact';

const { create, update, remove, loading } = actions;

export default handleActions(
  {
    create: (contacts, { payload: contact }) => ({
      ...contacts,
      [contact.id]: contact
    }),

    update: (contacts, { payload: contact }) => ({
      ...contacts,
      [contact.id]: {
        ...contacts[contact.id],
        ...contact
      }
    }),

    remove: (state, { payload: id }) => {
      const newState = { ...state };
      delete newState.contacts[id];
      return newState;
    },

    load: (contacts, { payload }) => {
      const schem = new schema.Entity('collection');
      const { entities: { collection } } = normalize(payload, [schem]);

      return {
        ...contacts,
        ...collection,
      }
    }
  }, { }
);
