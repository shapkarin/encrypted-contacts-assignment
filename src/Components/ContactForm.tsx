import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';

const ContactForm = ({ onSubmit, contact: { name, phone, email, address } = {}, edit, close, history: { push: navigate } }) => (
  <form onSubmit={onSubmit}>
    name: <input id="name" type='text' defaultValue={name}/><br/>
    phone: <input id="phone" type='text' defaultValue={phone}/><br/>
    email: <input id="email" type='text' defaultValue={email}/><br/>
    address: <input id="address" type='text' defaultValue={address}/>
    <Button htmlType="submit" type="primary">
      { edit ? 'Save' : 'Create' }
    </Button>
    <Button type="primary" onClick={() => navigate('/contacts')}>Close</Button>
  </form>
)

export default withRouter(ContactForm);
