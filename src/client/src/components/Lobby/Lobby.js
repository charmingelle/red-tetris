import React from 'react';
import { connect } from 'react-redux';
import './Lobby.css';
import { EnterNameForm } from '../EnterNameForm';
import { CreateRoomForm } from '../CreateRoomForm';
import { People } from '../People';

const joinRoom = (socket, id, myName) => () => {
  window.location.hash = `#${id}[${myName}]`;
  socket.emit('join-room', { roomId: id });
};

const RoomList = ({ myName, rooms, socket }) =>
  Object.values(rooms)
    .reverse()
    .map(({ id, game }) => (
      <div key={id} className="room-item">
        <div className="room-name">{id}</div>
        <div className="room-actions">
          {game ? (
            <div className="game-in-progress-label">Game on...</div>
          ) : (
            <button
              className="join-room-button"
              key={id}
              onClick={joinRoom(socket, id, myName)}
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
      <RoomList myName={myName} rooms={rooms} socket={socket} />
    ) : myName ? (
      <div className="no-rooms-label">No rooms yet</div>
    ) : (
      <div className="no-rooms-label">No rooms available yet</div>
    )}
  </div>
);

export const LobbyInner = ({ myName, people, rooms, socket, urlError }) => (
  <div className="lobby">
    <div className="lobby-left">
      {urlError && (
        <span className="url-error">
          http://localhost:5000/#room_name[player_name]
          <br />
          for room joining.
          <br /> Use alphabet letters, digits, -, _
          <br />
          for room amd player name.
          <br /> Maximum length is 15 charaters.
        </span>
      )}
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
      {myName && Object.values(people).length ? <People /> : null}
    </div>
  </div>
);

const mapStateToProps = ({ myName, people, rooms, socket, urlError }) => ({
  myName,
  people,
  rooms,
  socket,
  urlError,
});

export const Lobby = connect(mapStateToProps)(LobbyInner);
