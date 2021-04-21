import React, { Component } from 'react';
import connect from 'react-redux-connect';

export default function(ComposedComponent) {
      return @connect class RequireAuth extends Component {
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
}
