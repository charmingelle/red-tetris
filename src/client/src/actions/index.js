import {
  DROP_TETRO,
  LOAD_ROOM,
  LOAD_ROOMS,
  MOVE_TETRO,
  MOVE_TETRO_DOWN,
  ROTATE_TETR0,
  SET_TETRO,
  UPDATE_MY_ID,
} from '../constants';

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

export const setTetro = tetro => ({
  type: SET_TETRO,
  payload: tetro,
});

export const updateMyId = myId => ({
  type: UPDATE_MY_ID,
  payload: myId,
});
