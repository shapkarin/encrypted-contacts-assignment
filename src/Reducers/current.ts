import { handleActions } from 'redux-actions';
import { normalize, schema } from 'normalizr';

import { show } from '../Actions/contacts';

export default handleActions(
  {
    [show]: (_, { payload: current }) => ({ current }),
  }, { cuurent: ''}
);
