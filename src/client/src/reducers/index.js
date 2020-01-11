import { combineReducers } from 'redux';
import { rooms } from './rooms';
import { game } from './game';
import { showLobby } from './showLobby';
import { socket } from './socket';
import { room } from './room';
import { myData } from './myData';

export const allReducers = combineReducers({
  rooms,
  game,
  showLobby,
  socket,
  room,
  myData,
});
