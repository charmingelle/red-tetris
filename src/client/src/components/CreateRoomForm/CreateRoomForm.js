import React, { useState } from 'react';
import { connect } from 'react-redux';
import './CreateRoomForm.css';
import { isNameValid } from '../../utils';

const createRoom = (newRoomName, setNewRoomName, socket) => {
  if (isNameValid(newRoomName)) {
    socket.emit('create-room', { roomId: newRoomName });
    setNewRoomName('');
  }
};

const handleRoomNameChange = setNewRoomName => ({ target: { value } }) =>
  setNewRoomName(value);

const handleKeyPress = (newRoomName, setNewRoomName, socket) => ({ key }) => {
  if (key === 'Enter') {
    createRoom(newRoomName, setNewRoomName, socket);
  }
};

const handleButtonClick = (newRoomName, setNewRoomName, socket) => () =>
  createRoom(newRoomName, setNewRoomName, socket);

const CreateRoomFormInner = ({ socket }) => {
  const [newRoomName, setNewRoomName] = useState('');

  return (
    <div className="create-room-form">
      <div className="create-room-label">Create own room</div>
      <input
        className="create-room-input"
        value={newRoomName}
        type="text"
        placeholder="Enter name..."
        onChange={handleRoomNameChange(setNewRoomName)}
        onKeyPress={handleKeyPress(newRoomName, setNewRoomName, socket)}
        maxLength="15"
      />
      <button
        className="create-room-button"
        onClick={handleButtonClick(newRoomName, setNewRoomName, socket)}
      >
        Create
      </button>
    </div>
  );
};

const mapStateToProps = ({ socket }) => ({ socket });

export const CreateRoomForm = connect(mapStateToProps)(CreateRoomFormInner);
