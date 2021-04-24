import { combineReducers } from 'redux';

import user from './user';
import collection from './contacts';
import current from './current';

export default combineReducers({
  user,
  contacts: combineReducers({
    collection,
    current
  }),
});
