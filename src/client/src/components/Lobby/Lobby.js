import React from 'react';
import { connect } from 'react-redux';
import './Lobby.css';
import { EnterNameForm } from '../EnterNameForm';
import { CreateRoomForm } from '../CreateRoomForm';
import { LobbyPeople } from '../LobbyPeople';

const joinRoom = (socket, id) => () => socket.emit('join-room', { roomId: id });

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

const RoomListBoard = ({ myName, rooms, socket }) => (
  <div className="room-list">
    {myName && Object.values(rooms).length ? (
      <RoomList rooms={rooms} socket={socket} />
    ) : myName ? (
      <div className="no-rooms-label">No rooms yet</div>
    ) : (
      <div className="no-rooms-label">No rooms available yet</div>
    )}
  </div>
);

export const LobbyInner = ({ myName, people, rooms, socket }) => (
  <div className="lobby">
    <div className="lobby-left">
      <RoomListBoard myName={myName} rooms={rooms} socket={socket} />
    </div>
    <div className="lobby-right">
      <div className="enter-name-form-container">
        {myName ? (
          <div className="name-label">{`Hi, ${myName}`}</div>
        ) : (
          <EnterNameForm />
        )}
      </div>
      {myName ? <CreateRoomForm /> : null}
      {Object.values(people).length ? <LobbyPeople /> : null}
    </div>
  </div>
);

const mapStateToProps = ({ myName, people, rooms, socket }) => ({
  myName,
  people,
  rooms,
  socket,
});

export const Lobby = connect(mapStateToProps)(LobbyInner);
