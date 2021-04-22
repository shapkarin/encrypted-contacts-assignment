import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import connect from 'react-redux-connect';
import { Typography, Space, Input, Tooltip, Button, Row, Col, Layout, Divider } from 'antd';
import { LockFilled } from '@ant-design/icons';

import { load, create, update, remove } from '../Actions/contact';
import ContactDetails from '../Components/ContactDetails';

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
    isEdit: false,
    view: 'details'
  }

  create = async (event) => {
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

    await create({ name, phone, email, address });
    this.setState({ view: 'details' });
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

  remove = (id) => {
    this.props.remove(id);
  }

  // todo: refact later
  renderView({ name, current }) {
    const views = {
      details: (
        <ContactDetails contact={current} remove={() => { this.remove(current.id) }} />
      ),
      edit: (
        <Form
          onSubmit={this.update}
          contact={current}
          edit={true}
          close={() => this.setState({ view: 'details' })}
        />
      ),
      add: (
        <Form onSubmit={this.create} />
      )
    }
    return views[name] || '';
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
          { this.renderView({ name: this.state.view, current }) }
          {this.state.view === 'details' &&  <Button type="primary" onClick={() => this.setState({ view: 'edit' })}>Edit</Button>}
          {this.state.view === 'details' && <Button type="primary" onClick={() => this.setState({ view: 'add' })}>Add</Button>}
        </Content>
      </Layout>
    )
  }
}

export default Contacts;
