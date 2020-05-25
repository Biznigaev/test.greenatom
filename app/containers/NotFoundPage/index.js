import React from 'react';
import { Result, Button } from 'antd';

import messages from './messages';

export default function NotFound() {
  return (
    <Result
      status="404"
      title={messages.title}
      subTitle={messages.sub_title}
      extra={
        <Button type="primary" href="/">
          {messages.button_text}
        </Button>
      }
    />
  );
}
