import React, { Component } from 'react';
import { Switch, Router, Route, Link, withRouter, HashRouter } from 'react-router-dom';
import connect from 'react-redux-connect';
import { Typography, Space, Input, Tooltip, Button, Row, Col, Layout, Divider } from 'antd';
import { LockFilled } from '@ant-design/icons';

import { load, create, update, remove } from '../Actions/contact';
import ContactDetails from '../Components/ContactDetails';
import ContactForm from '../Components/ContactForm';

import { history } from '../App'

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

  async componentDidMount() {
    await this.props.load();
    this.setState({ selected: this.props.contacts[0]?.id });
  }

  state = {
    selected: '',
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
    this.props.history.push(this.props.match.url)
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
    this.props.history.push(this.props.match.url);
  }

  remove = (id) => {
    this.props.remove(id);
  }

  render () {
    const { contacts, collection } = this.props;
    const current = collection[this.state.selected];

    return (
      <Layout>
        <Sider theme="light">
          <aside>
            {this.props.contacts.map(({ name, id }) => (
              <div
                key={id}
                onClick={() => this.setState({ selected: id })}
                style={{ cursor: 'pointer' }}
              >
              { name }
            </div>
            ))}
          </aside>
        </Sider>
        <Content style={{background: 'white'}}>
          <HashRouter history={history}>
            <Switch>
              <Route
                exact
                path={this.props.match.path}
                render={(props) => (
                  <ContactDetails
                    {...props}
                    contact={current}
                    remove={() => this.remove(current.id)}
                  />
                )}
              />
              <Route
                path={`${this.props.match.path}/edit`}
                render={(props) => (
                  <ContactForm
                    {...props}
                    onSubmit={this.update}
                    contact={current}
                    edit={true}
                  />
                )}
              />
              <Route
                path={`${this.props.match.path}/add`}
                render={(props) => (
                  <ContactForm {...props} onSubmit={this.add} />
                )}
              />
            </Switch>
          </HashRouter>
          <Button type="primary" onClick={() => this.props.history.push(`${this.props.match.url}/add`)}>Add new contact</Button>
        </Content>
      </Layout>
    )
  }
}

export default withRouter(Contacts);
