import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import connect from 'react-redux-connect';

import { exist, create, check, } from '../Actions/user';

@connect
class Auth extends Component {
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

  render () {
    if(!this.state.alive) return <div></div>;

    const { isFirstRun } = this.state;

    return (
      <div>
        <h1>Welcome To Simple Secure Contact Manager</h1>
        <h2>Please enter a password for your { isFirstRun && 'new' } contact data file</h2>
        <form onSubmit={(event) => this.handleSubmit(event, isFirstRun)}>
          <input id="password" type='password'/>
          <button type="submit">Send</button>
        </form>
        {this.props.error.length > 0 && <div>{ this.props.error }</div>}
      </div>
    )
  };
}

export default withRouter(Auth);
