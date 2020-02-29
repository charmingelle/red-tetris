import {
  UPDATE_MY_ID,
  UPDATE_PEOPLE,
  UPDATE_ROOMS,
  UPDATE_ROOM,
  UPDATE_TETRO,
  MOVE_TETRO,
  DROP_TETRO,
  ROTATE_TETR0,
  MOVE_TETRO_DOWN,
  UPDATE_URL_ERROR,
  RESET_STORE,
} from '../constants';

export const updateMyId = myId => ({
  type: UPDATE_MY_ID,
  payload: myId,
});

export const updatePeople = people => ({
  type: UPDATE_PEOPLE,
  payload: people,
});

export const updateRooms = rooms => ({
  type: UPDATE_ROOMS,
  payload: rooms,
});

export const updateRoom = room => ({
  type: UPDATE_ROOM,
  payload: room,
});

export const updateTetro = tetro => ({
  type: UPDATE_TETRO,
  payload: tetro,
});

export const moveTetro = ({ left, top }) => ({
  type: MOVE_TETRO,
  payload: { left, top },
});

export const dropTetro = () => ({
  type: DROP_TETRO,
});

export const rotateTetro = () => ({
  type: ROTATE_TETR0,
});

export const moveTetroDown = () => ({
  type: MOVE_TETRO_DOWN,
});

export const updateUrlError = urlError => ({
  type: UPDATE_URL_ERROR,
  payload: urlError,
});

export const resetStore = id => ({ type: RESET_STORE, payload: id });
