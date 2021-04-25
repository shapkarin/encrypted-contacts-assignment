import React, { Component } from 'react';
import { Switch, Router, Route, Link, withRouter } from 'react-router-dom';
import connect from 'react-redux-connect';
import { Typography, Space, Input, Tooltip, Button, Row, Col, Layout, Divider } from 'antd';
import { LockFilled } from '@ant-design/icons';

import { load, create, update, remove, show, search } from '../Actions/contacts';
import { getCurrentContact, find } from '../Selectors/contacts';
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
    remove,
    show,
    search,
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
    event.preventDefault();

    const { target: { elements: { query: { value: query } } } } = event;

    this.setState({ found: find(query)(this.props.contacts) })
  }

  render () {
    const { contacts, current, remove, show, match: { path, url }, history: { push: navigate } } = this.props;

    return (
      <Layout>
        <Sider theme="light">
          <aside>
            {contacts.map(({ name, id }) => (
              <div
                key={id}
                onClick={() => show(id)}
                style={{ cursor: 'pointer' }}
              >
              { name }
            </div>
            ))}
          </aside>
        </Sider>
        <Content style={{background: 'white'}}>
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
          </Switch>
          <Button type="primary" onClick={() => navigate(`${url}/add`)}>Add new contact</Button>

          <form onSubmit={this.search}>
            <div>{ JSON.stringify(this.state.found.map(item => item)) }</div>
            <input id="query" />
            <Button htmlType="submit" type="primary">TEST SEARCH</Button>
          </form>
        </Content>
      </Layout>
    )
  }
}

export default withRouter(Contacts);
