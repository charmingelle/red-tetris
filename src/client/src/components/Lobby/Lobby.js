import React from 'react';
import { connect } from 'react-redux';
import './Lobby.css';

let newRoomName = null;

const joinRoom = (socket, id) => () => socket.emit('join-room', { roomId: id });

const createRoom = socket => () => {
  if (newRoomName) {
    socket.emit('create-room', { name: newRoomName });
  }
};

const changeNewRoomName = ({ target: { value } }) => (newRoomName = value);

const RoomList = ({ rooms, socket }) =>
  Object.values(rooms).length
    ? Object.values(rooms).map(({ id, name, game }) => (
        <button
          className="room-button"
          key={id}
          disabled={game !== null}
          onClick={joinRoom(socket, id)}
        >{`Join Room ${name}`}</button>
      ))
    : null;

const CreateRoomForm = ({ socket }) => (
  <div>
    <label htmlFor="room-name">Create own room:</label>
    <input
      type="text"
      name="room-name"
      placeholder="Room name"
      onChange={changeNewRoomName}
      required
    ></input>
    <button className="room-button" onClick={createRoom(socket)}>
      Create
    </button>
  </div>
);

export const LobbyInner = ({ rooms, socket }) => (
  <div className="lobby">
    <CreateRoomForm socket={socket} />
    <RoomList rooms={rooms} socket={socket} />
  </div>
);

const mapStateToProps = ({ rooms, socket }) => ({ rooms, socket });

export const Lobby = connect(mapStateToProps)(LobbyInner);
