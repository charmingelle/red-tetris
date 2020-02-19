import {
  UPDATE_MY_ID,
  LOAD_PEOPLE,
  LOAD_ROOM,
  LOAD_ROOMS,
  SET_TETRO,
  MOVE_TETRO,
  MOVE_TETRO_DOWN,
  DROP_TETRO,
  ROTATE_TETR0,
  UPDATE_MY_ROOM_ID,
} from '../constants';
import socketIOClient from 'socket.io-client';
import { store } from '../index';
import {
  loadPeople,
  loadRooms,
  loadRoom,
  updateMyId,
  setTetro,
  updateMyRoomId,
} from '../actions';
import { getRoomIdAndPlayerName } from '../utils/common';
import {
  wasPileCrossed,
  cannotMoveTetro,
  getRotatedFigure,
  getPileWithTetro,
  getPileWithDropedTetro,
  isGameOver,
  removeRows,
  getNewTetro,
  finishGame,
} from '../utils/game';

export const io = socketIOClient({
  query: getRoomIdAndPlayerName(window.location.hash),
});

io.on('update-people', ({ people }) => store.dispatch(loadPeople(people)));

io.on('update-rooms', ({ rooms }) => store.dispatch(loadRooms(rooms)));

io.on('send-id', ({ id }) => store.dispatch(updateMyId(id)));

io.on('update-room', ({ room }) => store.dispatch(loadRoom(room)));

io.on('set-tetro', ({ tetro }) => store.dispatch(setTetro(tetro)));

io.on('update-my-room-id', ({ myRoomId }) =>
  store.dispatch(updateMyRoomId(myRoomId)),
);

const initialState = {
  socket: io,
  myId: null,
  myRoomId: undefined,
  myName: null,
  people: {},
  rooms: {},
  tetro: null,
};

const getMyPile = state => state.rooms[state.myRoomId].players[state.myId].pile;

export const allReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_MY_ID: {
      return { ...state, myId: payload };
    }
    case LOAD_PEOPLE: {
      return {
        ...state,
        people: payload,
        myName: payload[state.myId],
      };
    }
    case LOAD_ROOMS: {
      return { ...state, rooms: payload };
    }
    case LOAD_ROOM: {
      return {
        ...state,
        rooms: { ...state.rooms, [payload.id]: payload },
      };
    }
    case UPDATE_MY_ROOM_ID: {
      return { ...state, myRoomId: payload };
    }
    case SET_TETRO: {
      const tetro = payload;
      const pile = getMyPile(state);

      if (isGameOver(tetro, pile)) {
        finishGame(state);
        return { ...state, tetro: null };
      }
      return { ...state, tetro };
    }
    case MOVE_TETRO: {
      const { tetro } = state;

      if (!tetro) {
        return state;
      }
      const { top, left } = payload;
      const newRow = tetro.row + top;
      const newCol = tetro.col + left;
      const pile = getMyPile(state);

      if (cannotMoveTetro(tetro.figure, newRow, newCol, pile)) {
        return state;
      }
      return {
        ...state,
        tetro: { ...tetro, row: newRow, col: newCol },
      };
    }
    case DROP_TETRO: {
      const { tetro } = state;

      if (!tetro) {
        return state;
      }
      const pile = getMyPile(state);

      removeRows(getPileWithDropedTetro(tetro, pile), state);
      getNewTetro(state);
      return state;
    }
    case ROTATE_TETR0: {
      const { tetro } = state;

      if (!tetro) {
        return state;
      }
      const rotatedFigure = getRotatedFigure(tetro.figure);
      const pile = getMyPile(state);

      if (cannotMoveTetro(rotatedFigure, tetro.row, tetro.col, pile)) {
        return state;
      }
      return {
        ...state,
        tetro: { ...tetro, figure: rotatedFigure },
      };
    }
    case MOVE_TETRO_DOWN: {
      const { tetro } = state;

      if (!tetro) {
        return state;
      }
      const pile = getMyPile(state);
      const newRow = tetro.row + 1;

      if (wasPileCrossed(tetro.figure, newRow, tetro.col, pile)) {
        removeRows(getPileWithTetro(tetro, pile), state);
        getNewTetro(state);
        return state;
      }
      return {
        ...state,
        tetro: { ...tetro, row: newRow },
      };
    }
    default: {
      return state;
    }
  }
};
