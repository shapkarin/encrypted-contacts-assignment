import React from 'react';
import { Button } from 'antd';

const ContactForm = ({ onSubmit, contact: { name, phone, email, address } = {}, edit, close }) => (
  <form onSubmit={onSubmit}>
    name: <input id="name" type='text' defaultValue={name}/><br/>
    phone: <input id="phone" type='text' defaultValue={phone}/><br/>
    email: <input id="email" type='text' defaultValue={email}/><br/>
    address: <input id="address" type='text' defaultValue={address}/>
    <Button htmlType="submit" type="primary">
      { edit ? 'Save' : 'Add' }
    </Button>
    {edit && <Button type="primary" onClick={close}>Close</Button>}
  </form>
)

export default ContactForm;
