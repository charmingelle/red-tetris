import React from 'react';
import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import { store } from '../../index';
import { Lobby } from '../Lobby';
import { Game } from '../Game';
import { loadRooms } from '../../actions/loadRooms';

const getRooms = () =>
  fetch('/rooms', { method: 'GET', credentials: 'include' })
    .then(res => res.json())
    .then(rooms => store.dispatch(loadRooms(rooms)))
    .catch(console.error);

const AppInner = ({ showLobby }) => {
  const login = 'user';

  socketIOClient({
    query: `login=${login}`,
  });
  getRooms();
  return showLobby ? <Lobby /> : <Game />;
};

const mapStateToProps = ({ showLobby }) => ({ showLobby });

export const App = connect(mapStateToProps)(AppInner);
