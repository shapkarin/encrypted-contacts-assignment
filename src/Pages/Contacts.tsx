import React, { Component, useState } from 'react';
import connect from 'react-redux-connect';
import { withRouter } from 'react-router-dom'

import { load, create, update, remove } from '../Actions/contact';

// // todo: just fast implementation
// const Editable = (props) => {
//   const [edit, setEdit] = useState(false);
//   const handleClick = () => {
//     setEdit(!edit);
//     // const text = refs.textarea.innerHTML;
//     // this.props.save();
//   };

//   return <div>
//     <div contenteditable={edit}>{ JSON.stringify(props.contact) }</div>
//     <button onClick={handleClick}>{ !edit ? 'Edit' : 'Save' }</button>
//   </div>
// };

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
              <button onClick={() => console.log('todo, action and endpoint are ready')}>Edit</button>
              <button onClick={() => this.props.remove(contact.id)}>Remove</button>
            </div>
          )) }
        </div>

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
