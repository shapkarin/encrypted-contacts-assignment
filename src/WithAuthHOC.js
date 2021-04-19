import React, { Component } from 'react';
import connect from 'react-redux-connect';

export default function(ComposedComponent) {
    @connect
    class Authentication extends Component {

      static mapStateToProps = ({ user }) => ({
        authenticated: user,
      });

      componentWillMount() {
          if(!this.props.authenticated) {
            this.props.history.push('/')
          }
      }

      render() {
          return <ComposedComponent/>
      }
    }
}
