import React, { useState } from 'react';
import { Button } from 'antd';
import ModalForm from 'components/ModalForm/Loadable';
import messages from './messages';

const CalendarModal = ({ createEvent, dateFormat }) => {
  const [visible, setVisible] = useState(false);
  const onCreate = values => {
    createEvent(values);
    setVisible(false);
  };
  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>
        {messages.button.modal}
      </Button>
      <ModalForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => setVisible(false)}
        dateFormat={dateFormat}
      />
    </div>
  );
};

export default CalendarModal;
