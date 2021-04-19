import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import connect from 'react-redux-connect';

import { load } from '../Actions/contact';

@connect
class Contacts extends Component {
  static mapDispatchToProps = {
    getContacts: load,
  }

  static mapStateToProps = ({ contacts }) => ({
    contacts: Object.keys(contacts).map(key => contacts[key]).sort((a, b) => a.name - b.name),
  })

  // static propTypes = {
  //   contacts: PropTypes.array.isRequired,
  // }

  render () {
    return (
      <div>
        { this.props.contacts.map(contact => (
          <div>{ JSON.stringify(contact) }</div>
        )) }
      </div>
    )
  }
}
