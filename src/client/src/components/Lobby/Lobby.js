import React from 'react';
import { connect } from 'react-redux';
import { changeShowLobby } from '../../actions/changeShowLobby';

const renderRooms = rooms =>
  rooms.length
    ? rooms.map(({ name }) => <button key={name}>{`Join Room ${name}`}</button>)
    : null;

const roomSelectHandler = changeShowLobby => () => changeShowLobby(false);

export const LobbyInner = ({ rooms, changeShowLobby }) => (
  <div>
    <button onClick={roomSelectHandler(changeShowLobby)}>
      Create Own Room
    </button>
    {renderRooms(rooms)}
  </div>
);

const mapStateToProps = ({ rooms }) => ({ rooms });

const mapDispatchToProps = { changeShowLobby };

export const Lobby = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LobbyInner);
