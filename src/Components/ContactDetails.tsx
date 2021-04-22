import React from 'react';
import { Typography, Button } from 'antd';

const { Text } = Typography;

const Details = ({ contact, remove }) => (
  <div>
    { Object.keys(contact).map((key) => (
      <div>
      {
        key !== 'id'
        &&
        <>
          {key}:
          <Text
            key={key}
          >
            {contact[key]}
          </Text>
        </>
      }
      </div>
    ))}
    <Button type="primary" onClick={remove}>Remove</Button>
  </div>
)

export default Details;
