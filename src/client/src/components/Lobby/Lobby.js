import React, { useState } from 'react';
import { connect } from 'react-redux';
import './Lobby.css';

const joinRoom = (socket, id) => () => socket.emit('join-room', { roomId: id });

const createRoom = (newRoomName, setNewRoomName, socket) => () => {
  if (newRoomName) {
    socket.emit('create-room', { name: newRoomName });
    setNewRoomName('');
  }
};

const changeNewRoomName = setNewRoomName => ({ target: { value } }) =>
  setNewRoomName(value);

const CreateRoomForm = ({ socket }) => {
  const [newRoomName, setNewRoomName] = useState('');

  return (
    <div className="lobby-right">
      <div className="create-room-form">
        <div className="create-room-label">Create own room:</div>
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
    </div>
  );
};

const RoomList = ({ rooms, socket }) =>
  Object.values(rooms)
    .reverse()
    .map(({ id, name, game }) => (
      <div key={id} className="room-item">
        <div className="room-name">{name}</div>
        <div className="room-actions">
          {game ? (
            <div className="game-in-progress-label">Game on...</div>
          ) : (
            <button
              className="join-room-button"
              key={id}
              onClick={joinRoom(socket, id)}
            >
              Join
            </button>
          )}
        </div>
      </div>
    ));

const RoomListBoard = ({ rooms, socket }) => (
  <div className="lobby-left">
    <div className="room-list">
      {Object.values(rooms).length ? (
        <RoomList rooms={rooms} socket={socket} />
      ) : (
        <div className="no-rooms-label">No rooms yet</div>
      )}
    </div>
  </div>
);

export const LobbyInner = ({ rooms, socket }) => (
  <div className="lobby">
    <RoomListBoard rooms={rooms} socket={socket} />
    <CreateRoomForm socket={socket} />
  </div>
);

const mapStateToProps = ({ rooms, socket }) => ({ rooms, socket });

export const Lobby = connect(mapStateToProps)(LobbyInner);
