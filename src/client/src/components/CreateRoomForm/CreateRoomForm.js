import React, { useState } from 'react';
import { connect } from 'react-redux';
import './CreateRoomForm.css';
import { isNameValid } from '../../utils/common';

const createRoom = (roomName, setRoomName, socket, setRoomNameError) => {
  if (isNameValid(roomName)) {
    socket.emit('create-room', { roomId: roomName });
    setRoomName('');
  } else {
    setRoomNameError(true);
  }
};

const handleRoomNameChange = (setRoomName, setRoomNameError) => ({
  target: { value },
}) => {
  setRoomName(value);
  setRoomNameError(false);
};

const handleKeyPress = (roomName, setRoomName, socket, setRoomNameError) => ({
  key,
}) => {
  if (key === 'Enter') {
    createRoom(roomName, setRoomName, socket, setRoomNameError);
  }
};

const handleButtonClick = (
  roomName,
  setRoomName,
  socket,
  setRoomNameError,
) => () => createRoom(roomName, setRoomName, socket, setRoomNameError);

const CreateRoomFormInner = ({ socket }) => {
  const [roomName, setRoomName] = useState('');
  const [roomNameError, setRoomNameError] = useState(false);

  return (
    <div className="create-room-form">
      <div className="create-room-label">Create own room</div>
      {roomNameError && (
        <div className="enter-room-name-error">
          Althabet letters, digits, -, _ are allowed. Maximum length is 15
          symbols.
        </div>
      )}
      <input
        className="create-room-input"
        value={roomName}
        type="text"
        placeholder="Enter name..."
        onChange={handleRoomNameChange(setRoomName, setRoomNameError)}
        onKeyPress={handleKeyPress(
          roomName,
          setRoomName,
          socket,
          setRoomNameError,
        )}
        maxLength="15"
        autoFocus
      />
      <button
        className="create-room-button"
        onClick={handleButtonClick(
          roomName,
          setRoomName,
          socket,
          setRoomNameError,
        )}
      >
        Create
      </button>
    </div>
  );
};

const mapStateToProps = ({ socket }) => ({ socket });

export const CreateRoomForm = connect(mapStateToProps)(CreateRoomFormInner);
