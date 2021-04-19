import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from '../Reducers/root';

const DEBUG = process.env.NODE_ENV !== 'production';

const composeEnhancers = DEBUG && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 }) || compose;

function configureStore() {
  const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

  return store;
}

export default configureStore();
