import React, { Component } from 'react';
import connect from 'react-redux-connect';
import { withRouter } from 'react-router-dom'

export default function(ComposedComponent) {
    @connect
    class Authentication extends Component {

      static mapStateToProps = ({ user }) => ({
        authenticated: user,
      });

      componentDidMount() {
        console.log({ user: this.props.authenticated })
        if(!this.props.authenticated) {
          // this.props.history.push('/')
          console.log('Please auth');
        }
      }

      render() {
          return <ComposedComponent/>
      }
    }
}
