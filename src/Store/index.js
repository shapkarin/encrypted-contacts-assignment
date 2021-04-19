import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from '../Reducers/root';

// const DEBUG = process.env.NODE_ENV !== 'production';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 }) || compose;


function configureStore() {
  const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

  return store;
}

export default configureStore();
