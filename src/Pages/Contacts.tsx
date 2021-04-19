import React, { Component, useState } from 'react';
import connect from 'react-redux-connect';
import { withRouter } from 'react-router-dom'

import { load, create, update, remove } from '../Actions/contact';

const Form = ({ onSubmit, name, phone, email, address }) => (
  <form onSubmit={onSubmit}>
    name: <input id="name" type='text'/><br/>
    phone: <input id="phone" type='text'/><br/>
    email: <input id="email" type='text'/><br/>
    address: <input id="address" type='text'/>
    <button type="submit">Add</button>
  </form>
)

@connect
class Contacts extends Component {
  static mapDispatchToProps = {
    load,
    create,
    update,
    remove
  }

  static mapStateToProps = ({ contacts }) => ({
    contacts: Object.keys(contacts).map(key => contacts[key]).sort((a, b) => a.name - b.name),
  })

  componentDidMount() {
    this.props.load();
  }

  state = {
    selected: null,
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
    const { create, load } = this.props;

    create({ name, phone, email, address });
  }

  render () {
    return (
      <div>
        <div>
          { this.props.contacts.map(contact => (
            <div>
              <div> { JSON.stringify(contact) } </div>
              <button>Edit</button>
              <button onClick={() => this.props.remove(contact.id)}>Remove</button>
            </div>
          )) }
        </div>

        <Form onSubmit={this.create} />
      </div>
    )
  }
}

export default withRouter(Contacts);
