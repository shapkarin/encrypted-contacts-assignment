import React, { Component } from 'react';
import connect from 'react-redux-connect';
import { withRouter } from 'react-router-dom'

import { load, create } from '../Actions/contact';

@connect
class Contacts extends Component {
  static mapDispatchToProps = {
    load,
    create
  }

  static mapStateToProps = ({ contacts }) => ({
    contacts: Object.keys(contacts).map(key => contacts[key]).sort((a, b) => a.name - b.name),
  })

  componentDidMount() {
    this.props.load();
  }

  create = (event) => {
    event.preventDefault();
    const {
      target: {
        elements: {
          name: { value: name },
          phone: { value: phone },
          email: { value: email },
          address: { value: address }
        }
      }
    } = event;
    this.props.create({ name, phone, email, address });
  }

  render () {
    return (
      <div>
        <div>
          { this.props.contacts.map(contact => (
            <div>{ JSON.stringify(contact) }</div>
          )) }
        </div>
        <button>Edit</button>
        <form onSubmit={this.create}>
          name: <input id="name" type='text'/><br/>
          phone: <input id="phone" type='text'/><br/>
          email: <input id="email" type='text'/><br/>
          address: <input id="address" type='text'/>
          <button type="submit">Add</button>
        </form>
      </div>
    )
  }
}

export default withRouter(Contacts);
