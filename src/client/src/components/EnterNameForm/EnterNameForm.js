import React, { useState } from 'react';
import { connect } from 'react-redux';
import './EnterNameForm.css';
import { isNameValid } from '../../utils';

const saveName = (name, setName, socket) => {
  if (isNameValid(name)) {
    socket.emit('set-name', { name });
    setName('');
  }
};

const handleNameChange = setName => ({ target: { value } }) => setName(value);

const handleKeyPress = (name, setName, socket) => ({ key }) => {
  if (key === 'Enter') {
    saveName(name, setName, socket);
  }
};

const handleButtonClick = (name, setName, socket) => () =>
  saveName(name, setName, socket);

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
        onChange={handleNameChange(setName)}
        onKeyPress={handleKeyPress(name, setName, socket)}
        maxLength="15"
      />
      <button
        className="enter-name-button"
        onClick={handleButtonClick(name, setName, socket)}
      >
        Confirm
      </button>
    </div>
  );
};

const mapStateToPros = ({ socket }) => ({ socket });

export const EnterNameForm = connect(mapStateToPros)(EnterNameFormInner);
