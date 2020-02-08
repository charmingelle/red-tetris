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
  RIGHT_LIMIT,
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

const isHashValid = hash =>
  hash && hash[hash.length - 1] === ']' && hash.split('[').length === 2;

const getRoomNameAndPlayerName = hash => {
  const cutHash = hash.substring(1, hash.length - 1);

  return {
    roomId: cutHash.split('[')[0],
    playerName: cutHash.split('[')[1],
  };
};

export const io = socketIOClient({
  query: isHashValid(window.location.hash)
    ? getRoomNameAndPlayerName(window.location.hash)
    : { anonymous: true },
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

const wasPileHit = (figure, row, col, pile) => {
  const lastRow = pile.length - 1;

  for (let rowIndex = 0; rowIndex < figure.length; rowIndex++) {
    for (let colIndex = 0; colIndex < figure[rowIndex].length; colIndex++) {
      if (figure[rowIndex][colIndex] !== 0 && row + rowIndex > lastRow) {
        return true;
      }
      if (
        figure[rowIndex][colIndex] !== 0 &&
        pile[rowIndex + row][colIndex + col] !== 0
      ) {
        return true;
      }
    }
  }
  return false;
};

const isTetroInsideField = (figure, row, col, pile) => {
  for (let rowIndex = 0; rowIndex < figure.length; rowIndex++) {
    for (let colIndex = 0; colIndex < figure[rowIndex].length; colIndex++) {
      const elRow = rowIndex + row;
      const elCol = colIndex + col;

      if (
        figure[rowIndex][colIndex] !== 0 &&
        (elRow < 0 || elRow >= pile.length || elCol < 0 || elCol >= RIGHT_LIMIT)
      ) {
        return false;
      }
    }
  }
  return true;
};

const cannotMoveTetro = (figure, row, col, pile) =>
  !isTetroInsideField(figure, row, col, pile) ||
  wasPileHit(figure, row, col, pile);

const transposeMatrix = figure => {
  const figureSize = figure.length;
  let temp;

  for (let i = 0; i < figureSize; i++) {
    for (let j = i; j < figureSize; j++) {
      temp = figure[i][j];
      figure[i][j] = figure[j][i];
      figure[j][i] = temp;
    }
  }
};

const reverseColumns = figure => {
  const figureSize = figure.length;
  let temp;

  for (let i = 0; i < figureSize; i++) {
    for (let j = 0, k = figureSize - 1; j < k; j++, k--) {
      temp = figure[j][i];
      figure[j][i] = figure[k][i];
      figure[k][i] = temp;
    }
  }
};

const getRotatedFigure = figure => {
  const rotatedFigure = JSON.parse(JSON.stringify(figure));

  transposeMatrix(rotatedFigure);
  reverseColumns(rotatedFigure);
  return rotatedFigure;
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

const getPileWithDropedTetro = (tetro, pile) => {
  const { figure, col, color } = tetro;

  for (let rowIndex = 0; rowIndex < pile.length; rowIndex++) {
    if (wasPileHit(figure, rowIndex, col, pile)) {
      const newPile = JSON.parse(JSON.stringify(pile));

      figure.forEach((figureFow, figureRowIndex) =>
        figureFow.forEach((_el, colIndex) => {
          if (figure[figureRowIndex][colIndex] !== 0) {
            newPile[figureRowIndex + rowIndex - 1][colIndex + col] = color;
          }
        }),
      );
      return newPile;
    }
  }
  return pile;
};

const getPileWithTetro = (tetro, pile) => {
  const { figure, row, col, color } = tetro;
  const newPile = JSON.parse(JSON.stringify(pile));

  figure.forEach((figureFow, rowIndex) =>
    figureFow.forEach((_el, colIndex) => {
      if (figure[rowIndex][colIndex] !== 0) {
        newPile[rowIndex + row][colIndex + col] = color;
      }
    }),
  );
  return newPile;
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

const isGameOver = (newTetro, pile) => {
  const { figure, row, col } = newTetro;

  for (let i = 0; i < figure.length; i++) {
    for (let j = 0; j < figure[i].length; j++) {
      if (pile[i + row][j + col] !== 0) {
        return true;
      }
    }
  }
  return false;
};

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

      if (wasPileHit(tetro.figure, newRow, tetro.col, pile)) {
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
