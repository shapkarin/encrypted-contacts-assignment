import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import connect from 'react-redux-connect';

import { exist, create, check } from '../Actions/user';

@connect
class Auth extends Component {
  static mapStateToProps = ({ user }) => ({ user });

  static mapDispatchToProps = {
    addUser: create,
    checkUser: check,
  }

  // static propTypes = {
  //   contacts: PropTypes.array.isRequired,
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

  handleSubmit = async (event, isFirstRun) => {
    event.preventDefault();
    const { target: { elements: { password: { value: password } } } } = event;
    const { history: { push: navigate }, user, addUser, checkUser } = this.props;

    if (isFirstRun) {
      await addUser(password);
    } else if (!isFirstRun) {
      await checkUser(password);
    }

    if (user) {
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
      </div>
    )
  };
}

export default withRouter(Auth);
