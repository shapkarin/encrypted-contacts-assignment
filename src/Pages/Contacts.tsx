import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import connect from 'react-redux-connect';
import { Typography, Space, Input, Tooltip, Button, Row, Col, Layout, Divider } from 'antd';
import { LockFilled } from '@ant-design/icons';

import { load, create, update, remove } from '../Actions/contact';
import ContactDetails from '../Components/ContactDetails';
import ContactForm from '../Components/ContactForm';

const { Title, Text } = Typography;
const { Header, Sider, Content, Footer } = Layout;

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
    view: 'details'
  }

  add = async (event) => {
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
    this.setState({ view: 'details' });
  }

  remove = (id) => {
    this.props.remove(id);
  }

  // can be replaced with router
  renderView({ name, current }) {
    const views = {
      details: (
        <ContactDetails
          contact={current}
          remove={() => this.remove(current.id)}
          edit={() => this.setState({ view: 'edit' })}
        />
      ),
      edit: (
        <ContactForm
          onSubmit={this.update}
          contact={current}
          edit={true}
          close={() => this.setState({ view: 'details' })}
        />
      ),
      add: (
        <ContactForm onSubmit={this.add} />
      )
    }
    return views[name] || '';
  }

  render () {
    const { contacts, collection } = this.props;

    return (
      <Layout>
        <Sider theme="light">
          <aside>
            {this.props.contacts.map(({ name, id }) => (
              <div key={id} onClick={() => this.setState({ selected: id })}> { name } </div>
            ))}
          </aside>
        </Sider>
        <Content style={{background: 'white'}}>
          {this.renderView({ name: this.state.view, current: collection[this.state.selected] })}
          {this.state.view === 'details' && <Button type="primary" onClick={() => this.setState({ view: 'add' })}>Add</Button>}
        </Content>
      </Layout>
    )
  }
}

export default Contacts;
