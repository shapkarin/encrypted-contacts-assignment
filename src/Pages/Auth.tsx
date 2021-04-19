import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom'
import connect from 'react-redux-connect';

import { exist, create, check, } from '../Actions/user';

@connect
class Auth extends PureComponent {
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
    hasUser: this.props.user
  }

  componentDidMount() {
    this.checkIfFirstRun();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.user) {
      this.setState({ hasUser: nextProps.user });
    }
  }

  checkIfFirstRun = async () => {

    const isExist = await exist();
    this.setState({ isFirstRun: !isExist, alive: true });
  }


  handleSubmit = async (event, isFirstRun) => {

    event.preventDefault();
    const { target: { elements: { password: { value: password } } } } = event;
    const { history: { push: navigate }, addUser, checkUser } = this.props;

    try {
      if (isFirstRun) {
        await addUser(password);
      } else {
        await checkUser(password);
      }
      if (this.state.hasUser) {
        navigate('/contacts');
      }
    } catch (err) {
      console.log(err);
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
