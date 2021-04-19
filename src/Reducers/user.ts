import { handleActions } from 'redux-actions';
import { normalize, schema } from 'normalizr';

import { actions } from '../Actions/user';

const { create, check, error } = actions;

export default handleActions(
  {
    [create]: (state) => ({
      ...state,
      authed: true
    }),
    [check]: (state, { payload: status }) => ({
      error: status ? '' : state.error,
      authed: status,
    }),
    [error]: (state, { payload }) => ({
      ...state,
      error: payload
    }),
  }, { authed: false, error: '' }
);
