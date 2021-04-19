import React, { Component } from 'react';
import connect from 'react-redux-connect';

import { load } from '../Actions/contact';

@connect
class Contacts extends Component {
  static mapDispatchToProps = {
    load,
  }

  static mapStateToProps = ({ contacts }) => ({
    contacts: [] // Object.keys(contacts).map(key => contacts[key]).sort((a, b) => a.name - b.name),
  })

  componentDidMount() {
    // this.props.load();
  }

  render () {
    return (
      <div>
        qaskd;mas;kda;ksdk;
        { this.props.contacts.map(contact => (
          <div>{ JSON.stringify(contact) }</div>
        )) }
      </div>
    )
  }
}

export default Contacts;
