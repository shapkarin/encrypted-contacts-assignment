import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';

import { remove } from '../Actions/contacts';
import { getCurrentContact } from '../Selectors/contacts';

const Details = ({ contact, remove, edit, history, match }) => {
  if (contact === undefined) return null;

  return <div>
    { Object.keys(contact).map((key) => (
      <div key={key}>
        {
          key !== 'id'
          &&
          <>
            {key}: {contact[key]}
          </>
        }
      </div>
    ))}
    <div>
      <Button type="primary" onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
      <Button type="primary" onClick={() => remove(contact.id)}>Remove</Button>
    </div>
  </div>
};

const mapStateToProps = ({ contacts }) => ({
  contact: getCurrentContact(contacts),
});

const mapDispatchToProps = { remove };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Details));
