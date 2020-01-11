import React from 'react';
import { connect } from 'react-redux';
import './Lobby.css';
import { changeShowLobby } from '../../actions/changeShowLobby';

let newRoomName = null;

const joinRoom = (socket, changeShowLobby, id) => () => {
  socket.emit('join-room', { roomId: id });
  changeShowLobby(false);
};

const renderRooms = (rooms, socket, changeShowLobby) =>
  rooms.length
    ? rooms.map(({ id, name, game }) => (
        <button
          className="room-button"
          key={id}
          disabled={game !== null}
          onClick={joinRoom(socket, changeShowLobby, id)}
        >{`Join Room ${name}`}</button>
      ))
    : null;

const createRoom = (socket, changeShowLobby) => () => {
  if (newRoomName) {
    socket.emit('create-room', { name: newRoomName });
    changeShowLobby(false);
  }
};

const changeNewRoomName = ({ target: { value } }) => (newRoomName = value);

const renderCreateRoomForm = (socket, changeShowLobby) => (
  <form>
    <label htmlFor="room-name">Create own room:</label>
    <input
      type="text"
      name="room-name"
      placeholder="Room name"
      onChange={changeNewRoomName}
      required
    ></input>
    <button
      className="room-button"
      onClick={createRoom(socket, changeShowLobby)}
    >
      Create
    </button>
  </form>
);

export const LobbyInner = ({ rooms, socket, changeShowLobby }) => (
  <div className="lobby">
    {renderCreateRoomForm(socket, changeShowLobby)}
    {renderRooms(rooms, socket, changeShowLobby)}
  </div>
);

const mapStateToProps = ({ rooms, socket }) => ({ rooms, socket });

const mapDispatchToProps = { changeShowLobby };

export const Lobby = connect(mapStateToProps, mapDispatchToProps)(LobbyInner);
