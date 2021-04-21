import React, { Component, useState } from 'react';
import connect from 'react-redux-connect';
import { withRouter } from 'react-router-dom'
import { Typography, Space, Input, Tooltip, Button, Row, Col, Layout, Divider } from 'antd';
import { LockFilled } from '@ant-design/icons';

import { load, create, update, remove } from '../Actions/contact';

const { Title, Text } = Typography;
const { Header, Sider, Content, Footer } = Layout;

const Form = ({ onSubmit, contact = {}, edit }) => (
  <form onSubmit={onSubmit}>
    name: <input id="name" type='text'/><br/>
    phone: <input id="phone" type='text'/><br/>
    email: <input id="email" type='text'/><br/>
    address: <input id="address" type='text'/>
    <button type="submit">{ edit ? 'Save' : 'Add' }</button>
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
    collection: contacts
  })

  componentDidMount() {
    this.props.load().then(() => {
      console.log('loaded');
      this.setState({ selected: this.props.contacts[0]?.id })
    });
  }

  state = {
    selected: '',
    isEdit: false
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
    const { create } = this.props;

    create({ name, phone, email, address });
  }

  edit = () => {
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
    this.props.update({ id: this.state.selected, name, phone, email, address })
  }

  render () {
    const { contacts, collection } = this.props;
    const current = collection[this.state.selected] || {};

    return (
      <Layout>
        <Sider theme="light">
          <aside>
            { this.props.contacts.map(({ name, id }) => (
              <div key={id} onClick={() => this.setState({ selected: id })}> { name } </div>
            )) }
          </aside>
        </Sider>
        <Content style={{background: 'white'}}>
          <div>
            { Object.keys(current).map((key) => (
              <div>
              {
                key !== 'id'
                &&
                <>
                  {key}:
                  <Text
                    editable={this.state.isEdit}
                    key={key}
                  >
                    {current[key]}
                  </Text>
                </>
              }
              </div>
            )) }
            <button onClick={() => this.props.remove(current.id)}>Remove</button>
            <button onClick={() => console.log('todo the UI')}>Edit</button>
            {/* <button onClick={() => {}}>Edit</button> */}
          </div>
          <Divider>Add a contact</Divider>
          <Form onSubmit={this.create} />
        </Content>
      </Layout>
    )
  }
}

export default withRouter(Contacts);
