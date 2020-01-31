import {
  UPDATE_MY_ID,
  LOAD_ROOM,
  LOAD_ROOMS,
  CHANGE_SHOW_LOBBY,
  SET_TETRO,
  MOVE_TETRO,
  MOVE_TETRO_DOWN,
  DROP_TETRO,
  ROTATE_TETR0,
  RIGHT_LIMIT,
} from '../constants';
import socketIOClient from 'socket.io-client';
import { store } from '../index';
import { loadRooms, loadRoom, updateMyId, setTetro } from '../actions';

const login = 'user';

export const io = socketIOClient({
  query: `login=${login}`,
});

io.on('update-rooms', ({ rooms }) => store.dispatch(loadRooms(rooms)));

io.on('send-id', ({ id }) => store.dispatch(updateMyId(id)));

io.on('update-room', ({ room }) => store.dispatch(loadRoom(room)));

io.on('set-tetro', ({ tetro }) => store.dispatch(setTetro(tetro)));

const initialPile = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const initialState = {
  showLobby: true,
  myId: null,
  rooms: [],
  socket: io,
  roomId: null,
  roomName: null,
  leader: null,
  players: {},
  roomGame: null,
  game: {
    pile: initialPile,
    tetro: null,
    score: 0,
    isOver: false,
  },
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

const isTetroInsideField = (pile, figure, row, col) => {
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

const getPileWithRemovedRows = (pile, socket, roomId, playerId) => {
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
  increaseMyScore(socket, roomId, playerId, points);
  return { newPile, points };
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

const getPileWithTetro = (pile, tetro) => {
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

const getNewTetro = state =>
  state.socket.emit('get-tetro', {
    roomId: state.roomId,
    playerId: state.myId,
  });

const setMyPile = (socket, roomId, playerId, pile) =>
  socket.emit('set-pile', {
    roomId,
    playerId,
    pile,
  });

const increaseMyScore = (socket, roomId, playerId, points) =>
  socket.emit('increase-score', {
    roomId,
    playerId,
    points,
  });

const isGameOver = (newTetro, pile) => {
  const { figure, row, col } = newTetro;

  for (let i = 0; i < figure.length; i++) {
    for (let j = 0; j < figure[i].length; j++) {
      if (!pile[i + row] || pile[i + row][j + col] !== 0) {
        return true;
      }
    }
  }
  return false;
};

const finishGame = (socket, roomId, playerId) =>
  socket.emit('finish-game', {
    roomId,
    playerId,
  });

export const allReducers = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ROOM: {
      const { id, name, leader, players, game } = action.payload;

      return {
        ...state,
        roomId: id,
        roomName: name,
        leader,
        players,
        roomGame: game,
      };
    }
    case UPDATE_MY_ID: {
      return { ...state, myId: action.payload };
    }
    case LOAD_ROOMS: {
      return { ...state, rooms: action.payload };
    }
    case CHANGE_SHOW_LOBBY: {
      return { ...state, showLobby: action.payload };
    }
    case SET_TETRO: {
      if (isGameOver(action.payload, state.game.pile)) {
        finishGame(state.socket, state.roomId, state.myId);
        return {
          ...state,
          game: {
            ...state.game,
            tetro: action.payload,
            pile: state.game.pile,
            isOver: true,
          },
        };
      }
      return {
        ...state,
        game: {
          ...state.game,
          tetro: action.payload,
        },
      };
    }
    case MOVE_TETRO: {
      if (state.game.tetro) {
        const newRow = state.game.tetro.row + action.payload.top;
        const newCol = state.game.tetro.col + action.payload.left;

        if (
          !isTetroInsideField(
            state.game.pile,
            state.game.tetro.figure,
            newRow,
            newCol,
          )
        ) {
          return state;
        }
        if (
          wasPileHit(state.game.tetro.figure, newRow, newCol, state.game.pile)
        ) {
          return state;
        }
        return {
          ...state,
          game: {
            ...state.game,
            tetro: {
              figure: state.game.tetro.figure,
              row: newRow,
              col: newCol,
              color: state.game.tetro.color,
            },
          },
        };
      }
      return state;
    }
    case DROP_TETRO: {
      if (state.game.tetro) {
        const { newPile, points } = getPileWithRemovedRows(
          getPileWithDropedTetro(state.game.tetro, state.game.pile),
          state.socket,
          state.roomId,
          state.myId,
        );

        getNewTetro(state);
        setMyPile(state.socket, state.roomId, state.myId, newPile);
        return {
          ...state,
          game: {
            ...state.game,
            pile: newPile,
            score: state.game.score + points,
          },
        };
      }
      return state;
    }
    case ROTATE_TETR0: {
      if (state.game.tetro) {
        const rotatedFigure = getRotatedFigure(state.game.tetro.figure);

        if (
          !isTetroInsideField(
            state.game.pile,
            rotatedFigure,
            state.game.tetro.row,
            state.game.tetro.col,
          )
        ) {
          return state;
        }
        if (
          wasPileHit(
            rotatedFigure,
            state.game.tetro.row,
            state.game.tetro.col,
            state.game.pile,
          )
        ) {
          return state;
        }
        return {
          ...state,
          game: {
            ...state.game,
            tetro: {
              ...state.game.tetro,
              figure: rotatedFigure,
            },
          },
        };
      }
      return state;
    }
    case MOVE_TETRO_DOWN: {
      if (state.game.tetro) {
        const newRow = state.game.tetro.row + 1;

        if (
          wasPileHit(
            state.game.tetro.figure,
            newRow,
            state.game.tetro.col,
            state.game.pile,
          )
        ) {
          const { newPile, points } = getPileWithRemovedRows(
            getPileWithTetro(state.game.pile, state.game.tetro),
            state.socket,
            state.roomId,
            state.myId,
          );

          getNewTetro(state);
          setMyPile(state.socket, state.roomId, state.myId, newPile);
          return {
            ...state,
            game: {
              ...state.game,
              pile: newPile,
              score: state.game.score + points,
            },
          };
        } else {
          return {
            ...state,
            game: {
              ...state.game,
              tetro: {
                figure: state.game.tetro.figure,
                row: newRow,
                col: state.game.tetro.col,
                color: state.game.tetro.color,
              },
            },
          };
        }
      }
      return state;
    }
    default: {
      return state;
    }
  }
};
