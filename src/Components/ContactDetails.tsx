import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const Details = ({ contact }) => (
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
  </div>
)

export default Details;
