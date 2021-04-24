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
    this.passwordRef = React.createRef();
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
    hasUser: this.props.authed
  }

  componentDidMount() {
    this.checkIfFirstRun();
    // this.passwordRef.current!.focus();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.authed !== nextProps.authed) {
      this.setState({ hasUser: nextProps.authed });
    }
  }

  checkIfFirstRun = async () => {
    const isExist = await exist();
    this.setState({ isFirstRun: !isExist, alive: true });
  }

  handleSubmit = async (event, isFirstRun) => {
    event.preventDefault();
    const { target: { elements: { password: { value: password } } } } = event;
    const { history: { push: navigate }, addUser, checkUser, error } = this.props;

    if (isFirstRun) {
      await addUser(password);
    } else {
      await checkUser(password);
    }
    if (this.state.hasUser) {
      navigate('/contacts');
    }
  }

  quitApp(){
    ipcRenderer.send('quit')
  }

  render () {
    if(!this.state.alive) return <div></div>;

    const { isFirstRun } = this.state;

    return (
      <Space direction="vertical">
        <Title level={3}>Welcome To The Simple Secure Contact Manager</Title>
        <Text level={4}>Please enter a password for your { isFirstRun && 'new' } contact data file</Text>
        <form onSubmit={(event) => this.handleSubmit(event, isFirstRun)}>
          <Row>
            <Col span={17}>
              <Input.Password
                id="password"
                placeholder="Enter your password"
                prefix={<LockFilled className="site-form-item-icon" />}
                ref={this.passwordRef}
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
