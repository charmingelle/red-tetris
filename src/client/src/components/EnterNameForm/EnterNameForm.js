import React, { useState } from 'react';
import { connect } from 'react-redux';
import './EnterNameForm.css';
import { isNameValid } from '../../utils/common';

const saveName = (name, setName, socket, setNameError) => {
  if (isNameValid(name)) {
    socket.emit('set-name', { name });
    setName('');
  } else {
    setNameError(true);
  }
};

const handleNameChange = (setName, setNameError) => ({ target: { value } }) => {
  setName(value);
  setNameError(false);
};

const handleKeyPress = (name, setName, socket, setNameError) => ({ key }) => {
  if (key === 'Enter') {
    saveName(name, setName, socket, setNameError);
  }
};

const handleButtonClick = (name, setName, socket, setNameError) => () =>
  saveName(name, setName, socket, setNameError);

const EnterNameFormInner = ({ socket }) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);

  return (
    <div className="enter-name-form">
      <div className="enter-name-label">What's your name?</div>
      {nameError && (
        <div className="enter-name-error">
          Alphabet letters, digits, -, _ are allowed. Maximum length is 15
          symbols.
        </div>
      )}
      <input
        className="enter-name-input"
        value={name}
        type="text"
        placeholder="Enter name..."
        onChange={handleNameChange(setName, setNameError)}
        onKeyPress={handleKeyPress(name, setName, socket, setNameError)}
        maxLength="15"
        autoFocus
      />
      <button
        className="enter-name-button"
        onClick={handleButtonClick(name, setName, socket, setNameError)}
      >
        Confirm
      </button>
    </div>
  );
};

const mapStateToPros = ({ socket }) => ({ socket });

export const EnterNameForm = connect(mapStateToPros)(EnterNameFormInner);
