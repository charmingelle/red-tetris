import { combineReducers } from 'redux';
import { rooms } from './rooms';
import { game } from './game';
import { showLobby } from './showLobby';

export const allReducers = combineReducers({ rooms, game, showLobby });
