import React from 'react';
import { withRouter } from 'react-router-dom';
import { Typography, Button } from 'antd';

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
      <Button type="primary" onClick={remove}>Remove</Button>
      <Button type="primary" onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
    </div>
  </div>
}

export default withRouter(Details);
