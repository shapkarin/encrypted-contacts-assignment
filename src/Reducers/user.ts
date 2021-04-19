import { handleActions } from 'redux-actions';
import { normalize, schema } from 'normalizr';

import { actions } from '../Actions/user';

const { create, check } = actions;

export default handleActions(
  {
    [create]: () => ( true ),
    [check]: (_, { payload: status }) => ( status ),
  }, false
);
