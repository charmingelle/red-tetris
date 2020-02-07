import React, { useState } from 'react';
import { connect } from 'react-redux';
import './CreateRoomForm.css';

const createRoom = (newRoomName, setNewRoomName, socket) => () => {
  if (newRoomName) {
    socket.emit('create-room', { roomId: newRoomName });
    setNewRoomName('');
  }
};

const changeNewRoomName = setNewRoomName => ({ target: { value } }) =>
  setNewRoomName(value);

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
        onChange={changeNewRoomName(setNewRoomName)}
      />
      <button
        className="create-room-button"
        onClick={createRoom(newRoomName, setNewRoomName, socket)}
      >
        Create
      </button>
    </div>
  );
};

const mapStateToProps = ({ socket }) => ({ socket });

export const CreateRoomForm = connect(mapStateToProps)(CreateRoomFormInner);
