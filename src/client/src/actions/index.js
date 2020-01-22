import {
  CHANGE_SHOW_LOBBY,
  DROP_TETRO,
  LOAD_ROOM,
  LOAD_ROOMS,
  MOVE_TETRO,
  MOVE_TETRO_DOWN,
  ROTATE_TETR0,
  SET_OTHER_PILE,
  SET_OTHER_SCORE,
  SET_TETRO,
  UPDATE_MY_DATA,
} from '../constants';

export const changeShowLobby = showLobby => ({
  type: CHANGE_SHOW_LOBBY,
  payload: showLobby,
});

export const dropTetro = () => ({
  type: DROP_TETRO,
});

export const loadRoom = room => ({
  type: LOAD_ROOM,
  payload: room,
});

export const loadRooms = rooms => ({
  type: LOAD_ROOMS,
  payload: rooms,
});

export const moveTetro = ({ left, top }) => ({
  type: MOVE_TETRO,
  payload: { left, top },
});

export const moveTetroDown = () => ({
  type: MOVE_TETRO_DOWN,
});

export const rotateTetro = () => ({
  type: ROTATE_TETR0,
});

export const setOtherPile = ({ roomId, playerId, pile }) => ({
  type: SET_OTHER_PILE,
  payload: { roomId, playerId, pile },
});

export const setOtherScore = ({ roomId, playerId, score }) => ({
  type: SET_OTHER_SCORE,
  payload: { roomId, playerId, score },
});

export const setTetro = tetro => ({
  type: SET_TETRO,
  payload: tetro,
});

export const updateMyData = myData => ({
  type: UPDATE_MY_DATA,
  payload: myData,
});
