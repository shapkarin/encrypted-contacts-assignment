import { combineReducers } from 'redux';

import collection from './contacts';
import current from './current';

export default combineReducers({
  collection,
  current,
});
