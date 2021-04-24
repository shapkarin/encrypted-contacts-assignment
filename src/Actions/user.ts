// some kind of authentication
import { createAction } from 'redux-actions';

import request from '../request';
import { domain, headers } from './constants';

export const actions = {
  create: createAction('user/CREATE'),
  check: createAction('user/CHECK'),
  error: createAction('user/ERROR'),
};

export const create = (password) => async (dispatch) => {
  await request(`${domain}/api/user`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ password }),
  });
  dispatch(actions.create());
};

export const check = (password) => async (dispatch) => {
  try {
    await request(`${domain}/api/user/auth`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ password }),
    });
    dispatch(actions.check(true));
  } catch {
    dispatch(actions.error('The password is incorrect'));
    dispatch(actions.check(false));
  }
};

export const exist = async () => {
  try {
    await request(`${domain}/api/user/exist`);
    return true;
  } catch (err) {
    console.log({err});
    return false;
  }
};
