import React, { useState } from 'react';
import { connect } from 'react-redux';
import './EnterNameForm.css';

const saveName = (name, setName, socket) => () => {
  if (name) {
    socket.emit('set-name', { name });
    setName('');
  }
};

const onNameChange = setName => ({ target: { value } }) => setName(value);

const EnterNameFormInner = ({ socket }) => {
  const [name, setName] = useState('');

  return (
    <div className="enter-name-form">
      <div className="enter-name-label">What's your name?</div>
      <input
        className="enter-name-input"
        value={name}
        type="text"
        placeholder="Enter name..."
        onChange={onNameChange(setName)}
      />
      <button
        className="enter-name-button"
        onClick={saveName(name, setName, socket)}
      >
        Confirm
      </button>
    </div>
  );
};

const mapStateToPros = ({ socket }) => ({ socket });

export const EnterNameForm = connect(mapStateToPros)(EnterNameFormInner);
