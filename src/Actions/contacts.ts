import { createAction } from 'redux-actions';

import request from '../request';

export const actions = {
  create: createAction('contacts/CREATE'),
  update: createAction('contacts/UPDATE'),
  remove: createAction('contacts/REMOVE'),
  load: createAction('contacts/LOAD'),
  show: createAction('contacts/SHOW_BY_ID'),
}

const headers = { 'Content-Type': 'application/json' };
// todo: move at one place only
const domain = 'https://localhost:3042';

export const create = (contact) => async (dispatch) => {
  const newContact = await request(`${domain}/api/contacts`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ contact }),
  });
  dispatch(actions.create(newContact));
  dispatch(actions.show(newContact.id));
};

export const update = (contact) => async (dispatch) => {
  const updated = await request(`${domain}/api/contacts/${contact.id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ contact }),
  });
  dispatch(actions.update(updated));
};

export const remove = (id) => async (dispatch) => {
  await request(`${domain}/api/contacts/${id}`, {
    method: 'DELETE',
    headers,
  });
  dispatch(actions.remove(id));
};

export const load = () => async (dispatch) => {
  const contacts = await request(`${domain}/api/contacts/`);
  dispatch(actions.load(contacts));
};

export const show = actions.show;
