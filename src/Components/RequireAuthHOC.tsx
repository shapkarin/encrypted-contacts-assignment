import React, { Component } from 'react';
import connect from 'react-redux-connect';
import { withRouter } from 'react-router-dom';

export default function(ComposedComponent) {
  @connect class RequireAuth extends Component {
    constructor(props) {
      super(props);
      if(!this.props.authenticated) {
        this.props.history.push('/')
      }
    }

    static mapStateToProps = ({ user }) => ({
      authenticated: user,
    });

    render() {
        return <ComposedComponent/>
    }
  }
  return withRouter(RequireAuth);
}
