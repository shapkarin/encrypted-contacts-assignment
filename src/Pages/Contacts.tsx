import React, { Component } from 'react';
import { Switch, Router, Route, Link, NavLink, withRouter } from 'react-router-dom';
import connect from 'react-redux-connect';
import { Typography, Space, Input, Tooltip, Button, Row, Col, Layout, Divider, Menu, Breadcrumb, List } from 'antd';

import { load, create, update, show } from '../Actions/contacts';
import { getCurrentContact, find } from '../Selectors/contacts';
import ContactDetails from '../Components/ContactDetails';
import ContactForm from '../Components/ContactForm';
import Search from '../Components/Search';

const { Title, Text } = Typography;
const { Header, Sider, Content, Footer } = Layout;

@connect
class Contacts extends Component {
  static mapDispatchToProps = {
    load,
    create,
    update,
    show,
  }

  static mapStateToProps = ({ contacts: { collection, current }}) => ({
    contacts: Object.keys(collection).map(key => collection[key]).sort((a, b) => a.name - b.name),
    current: getCurrentContact({ collection, current }),
  })

  async componentDidMount () {
    await this.props.load();
    const { contacts: [first], show } = this.props;

    if(first) show(first.id);
  }

  state = {
    found: [],
  }

  getFormValues (event) {
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

    return { name, phone, email, address };
  }

  add = async (event) => {
    event.preventDefault();

    const { create, history: { push: navigate }, match: { url } } = this.props;

    await create(this.getFormValues(event));
    navigate(url);
  }

  update = async (event) => {
    event.preventDefault();

    const { update, current: { id }, history: { push: navigate }, match: { url } } = this.props;

    await update({ id, ...this.getFormValues(event) });
    navigate(url);
  }

  search = (value) => {
    this.setState({ found: find(value)(this.props.contacts) }, () => {
      this.props.history.push(`${this.props.match.path}/search/`)
    })
  }

  render () {
    const { contacts, current, show, match: { path, url } } = this.props;

    return (
      <Layout className="layout">
        <Header>
          <Input.Search
            placeholder="Search contact"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={this.search}
            style={{width: 250, marginTop: 10, marginRight: 20}}
          />
          <NavLink to={`${url}/add`} exact className="link" activeClassName="activeLink">Add contact</NavLink>
        </Header>
        <Layout>
          <Sider theme="light">
            <List
              size="large"
              header={<div>My contacts:</div>}
              bordered
              dataSource={contacts}
              renderItem={({ name, id }) => (
                <List.Item style={{ cursor: 'pointer' }} key={id} onClick={() => show(id)}>{name}</List.Item>
              )}
            />
          </Sider>
          <Content style={{ padding: '0 50px' }}>
            <div style={{ padding: 10 }}>
              <Switch>
                <Route
                  exact
                  path={path}
                  component={ContactDetails}
                />
                <Route path={`${path}/edit`}>
                  <ContactForm
                    onSubmit={this.update}
                    contact={current}
                    edit={true}
                  />
                </Route>
                <Route path={`${path}/add`}>
                  <ContactForm onSubmit={this.add} />
                </Route>
                <Route path={`${path}/search/`}>
                  <Search contacts={this.state.found}/>
                </Route>
              </Switch>
            </div>
          </Content>
        </Layout>
        <Footer>Encrypted contacts v1</Footer>
      </Layout>
    )
  }
}

export default withRouter(Contacts);
