import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { Typography, Button } from 'antd';

import { remove } from '../Actions/contacts';
import { getCurrentContact } from '../Selectors/contacts';

const { Text } = Typography;

const Details = ({ contact, remove, edit, history, match }) => {
  if (contact === undefined) return null;

  return <div>
    { Object.keys(contact).map((key) => (
      <div key={key}>
        {
          key !== 'id'
          &&
          <>
            {key}:
            <Text>{contact[key]}</Text>
          </>
        }
      </div>
    ))}
    <div>
      <Button type="primary" onClick={() => remove(contact.id)}>Remove</Button>
      <Button type="primary" onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
    </div>
  </div>
};

const mapStateToProps = ({ contacts }) => ({
  contact: getCurrentContact(contacts),
});

const mapDispatchToProps = { remove };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Details));
