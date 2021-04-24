import React, { Component } from 'react';
import connect from 'react-redux-connect';
import { Typography, Space, Input, Tooltip, Button, Row, Col, Layout } from 'antd';
import { LockFilled } from '@ant-design/icons';
import { ipcRenderer } from 'electron';

import { exist, create, check } from '../Actions/user';

const { Title, Text } = Typography;
const { Content } = Layout;

@connect
class Auth extends Component {
  constructor(props){
    super(props);
  }
  static mapStateToProps = ({ user: { authed, error } }) => ({
    authed,
    error
  });

  static mapDispatchToProps = {
    addUser: create,
    checkUser: check,
  }

  // static propTypes = {
  //   authed: PropTypes.boolean.isRequired,
  // }

  state = {
    alive: false,
    isFirstRun: true,
  }

  componentDidMount() {
    this.checkIfFirstRun();
  }

  checkIfFirstRun = async () => {
    const isExist = await exist();
    this.setState({ isFirstRun: !isExist, alive: true });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { target: { elements: { password: { value: password } } } } = event;
    const { history: { push: navigate }, addUser, checkUser, error } = this.props;

    if (this.state.isFirstRun) {
      await addUser(password);
    } else {
      await checkUser(password);
    }
    if (this.props.authed) {
      navigate('/contacts');
    }
  }

  quitApp () {
    ipcRenderer.send('quit')
  }

  render () {
    if(!this.state.alive) return null;

    const { isFirstRun } = this.state;

    return (
      <Space direction="vertical">
        <Title level={3}>
          Welcome To The Simple Secure Contact Manager
        </Title>
        <Text level={4}>
          Please enter a password for your { isFirstRun && 'new' } contact data file
        </Text>
        <form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={17}>
              <Input.Password
                autoFocus
                id="password"
                placeholder="Enter your password"
                prefix={<LockFilled />}
              />
            </Col>
            <Col span={7}>
              <Button
                htmlType="submit"
                block={true}
                type="primary"
              >
                { isFirstRun ? 'Create' : 'Login' }
              </Button>
            </Col>
            {this.props.error.length > 0 && <Text type="danger">{ this.props.error }</Text>}
          </Row>
          <Button
            type="primary"
            onClick={this.quitApp}
            style={{marginTop: 142}}
          >
            Close the app
          </Button>
        </form>

      </Space>
    )
  };
}

export default Auth;
