import React, { Component, useState } from 'react';
import connect from 'react-redux-connect';
import { Typography, Space, Input, Tooltip, Button, Row, Col, Layout, Divider } from 'antd';
import { LockFilled } from '@ant-design/icons';

import { load, create, update, remove } from '../Actions/contact';

const { Title, Text } = Typography;
const { Header, Sider, Content, Footer } = Layout;

const Form = ({ onSubmit, contact: { name, phone, email, address } = {}, edit, close }) => (
  <form onSubmit={onSubmit}>
    name: <input id="name" type='text' defaultValue={name}/><br/>
    phone: <input id="phone" type='text' defaultValue={phone}/><br/>
    email: <input id="email" type='text' defaultValue={email}/><br/>
    address: <input id="address" type='text' defaultValue={address}/>
    <Button htmlType="submit" type="primary">
      { edit ? 'Save' : 'Add' }
    </Button>
    {edit && <Button type="primary" onClick={close}>Close</Button>}
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

  update = async (event) => {
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
    await this.props.update({ id: this.state.selected, name, phone, email, address });
    this.setState({ isEdit: false });
  }

  remove = async (id) => {
    await this.props.remove(current.id);
    if (this.state.isEdit) {
      this.setState({ isEdit: false });
    }
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
          {!this.state.isEdit ? <div>
            { Object.keys(current).map((key) => (
              <div>
              {
                key !== 'id'
                &&
                <>
                  {key}:
                  <Text
                    key={key}
                  >
                    {current[key]}
                  </Text>
                </>
              }
              </div>
            ))} </div>
            :
            <Form
              onSubmit={this.update}
              contact={current}
              edit={true}
              close={() => this.setState({ isEdit: false })}
            />
            }
            <button onClick={() => this.remove(selected)}>Remove</button>
            {!this.state.isEdit &&  <button onClick={() => this.setState({ isEdit: true })}>Edit</button>}
          <Divider>Add a contact</Divider>
          <Form onSubmit={this.create} />
        </Content>
      </Layout>
    )
  }
}

export default Contacts;
