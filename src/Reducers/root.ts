import { combineReducers } from 'redux';

import user from './user';
import contacts from './contacts';
import current from './current';

export default combineReducers({
  user,
  contacts: combineReducers({
    collection: contacts,
    current
  }),
});
