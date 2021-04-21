import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';

import store from './Store';
import Contacts from './Pages/Contacts';
import Auth from './Pages/Auth';
import RequireAuth from './RequireAuthHOC';

import 'App.global.css';

const history = createHashHistory();

export default function App() {
  return (
    <Provider store={store}>
      <HashRouter history={history}>
        <Switch>
          <Route exact path="/" component={Auth} />
          <Route path="/contacts" component={RequireAuth(Contacts)} />
        </Switch>
      </HashRouter>
    </Provider>
  );
}
