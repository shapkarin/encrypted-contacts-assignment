import { handleActions } from 'redux-actions';

import { show } from '../../Actions/contacts';

export default handleActions(
  {
    [show]: (_, { payload: current }) => current,
  }, ''
);
