import React from 'react';
import { Typography, Button } from 'antd';

const { Text } = Typography;

const Details = ({ contact, remove, edit }) => {
  if (contact === undefined) return null;

  return <div>
    { Object.keys(contact).map((key) => (
      <div>
        {
          key !== 'id'
          &&
          <>
            {key}:
            <Text key={key}>{contact[key]}</Text>
          </>
        }
      </div>
    ))}
    <div>
      <Button type="primary" onClick={remove}>Remove</Button>
      <Button type="primary" onClick={edit}>Edit</Button>
    </div>
  </div>
}

export default Details;
