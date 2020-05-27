import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { firestore as db } from '../../firebase';
import messages from './messages';

const SelectPersons = ({ value = {}, onChange, userId }) => {
  const [participants, setParticipants] = useState([]);
  const [persons, setPersons] = useState([]);
  const [selectDisabled, toggleDisabled] = useState(true);
  const [selectLoading, toggleLoading] = useState(true);

  useEffect(() => {
    async function fetchPersons() {
      const usersRef = db.collection('users');
      const usersActual = await usersRef.get();
      setPersons(
        usersActual.docs
          .map(user => ({ ...user.data() }))
          .filter(({ uid }) => uid !== userId),
      );
      toggleDisabled(false);
      toggleLoading(false);
    }
    fetchPersons();
  }, []);

  const triggerChange = changedValue => {
    if (onChange) {
      onChange(changedValue);
    }
  };

  const handleChange = selectedValues => {
    setParticipants(selectedValues);
    triggerChange(selectedValues);
  };

  const { Option } = Select;

  return (
    <Select
      mode="multiple"
      style={{ width: 200 }}
      placeholder={messages.select_placeholder}
      loading={selectDisabled}
      disabled={selectLoading}
      value={value.participants || participants}
      onChange={handleChange}
    >
      {persons.map(person => (
        <Option key={person.uid} value={person.uid}>
          {person.login}
        </Option>
      ))}
    </Select>
  );
};

function mapStateToProps(state) {
  return {
    userId: state.auth.user.uid,
  };
}

export default connect(mapStateToProps)(SelectPersons);
