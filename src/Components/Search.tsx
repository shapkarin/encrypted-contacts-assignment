import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';

const Search = ({ contacts, history: { push: navigate }}) => (
  <div>
    {
      contacts.map(contact => (
        <div key={contact.id} style={{marginBottom: 20}}>
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
        </div>
      ))
    }
    <Button type="primary" onClick={() => navigate('/contacts')}>Close</Button>
  </div>
);

export default withRouter(Search);
