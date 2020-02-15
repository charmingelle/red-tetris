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

const removeRows = (pile, state) => {
  const newPile = JSON.parse(JSON.stringify(pile));
  let points = 0;

  for (let rowIndex = pile.length - 1; rowIndex >= 0; rowIndex--) {
    if (newPile[rowIndex].every(el => el !== 0)) {
      newPile.splice(rowIndex, 1);
      newPile.unshift(new Array(10).fill(0));
      rowIndex++;
      points++;
    }
  }
  increaseMyScore(points, state);
  setMyPile(newPile, state);
};

const getNewTetro = ({ socket, myRoomId, myId }) =>
  socket.emit('get-tetro', {
    roomId: myRoomId,
    playerId: myId,
  });

const setMyPile = (pile, { socket, myRoomId, myId }) =>
  socket.emit('set-pile', {
    roomId: myRoomId,
    playerId: myId,
    pile,
  });

const increaseMyScore = (points, { socket, myRoomId, myId }) =>
  socket.emit('increase-score', {
    roomId: myRoomId,
    playerId: myId,
    points,
  });

const finishGame = ({ socket, myRoomId, myId }) =>
  socket.emit('finish-game', {
    roomId: myRoomId,
    playerId: myId,
  });

const getMyPile = state => state.rooms[state.myRoomId].players[state.myId].pile;

export const allReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_MY_ID: {
      return { ...state, myId: payload };
    }
    case LOAD_PEOPLE: {
      const people = payload;

      return {
        ...state,
        people,
        myName: people[state.myId],
      };
    }
    case LOAD_ROOMS: {
      return { ...state, rooms: payload };
    }
    case LOAD_ROOM: {
      const room = payload;

      return {
        ...state,
        rooms: { ...state.room, [room.id]: room },
      };
    }
    case UPDATE_MY_ROOM_ID: {
      const myRoomId = payload;

      return { ...state, myRoomId };
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
