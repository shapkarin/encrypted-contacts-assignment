import React, { Component } from 'react';
import connect from 'react-redux-connect';
import { withRouter } from 'react-router-dom'

export default function(ComposedComponent) {
    @connect
    class Authentication extends Component {

      constructor() {
        super(props);
        console.log(123);
        console.log({ user: this.props.authenticated })
        if(!this.props.authenticated) {
          console.log('Please auth');
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
}
