import React, { useState } from 'react';
import { DatePicker, Form, Modal } from 'antd';
import SelectPersons from 'components/SelectPersons';
import moment from 'moment';
import './index.css';
import messages from './messages';

const ModalForm = ({ visible, onCreate, onCancel, dateFormat }) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    setConfirmLoading(true);
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        onCreate(values);
        setConfirmLoading(false);
      })
      .catch(info => {
        console.error([...info]);
      });
  };

  return (
    <Modal
      title={messages.header.title}
      visible={visible}
      okText={messages.button.ok}
      cancelText={messages.button.cancel}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          participants: [],
          start_at: moment(),
        }}
      >
        <Form.Item
          label={messages.field.start_at.label}
          name="start_at"
          rules={[
            {
              required: true,
              message: messages.field.start_at.validator.required,
            },
          ]}
        >
          <DatePicker format={dateFormat} />
        </Form.Item>
        <Form.Item
          name="participants"
          className="collection-create-form_last-form-item"
          rules={[
            {
              required: true,
              message: messages.field.participants.validator.required,
            },
          ]}
        >
          <SelectPersons />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalForm;
