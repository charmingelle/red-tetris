import {
  UPDATE_MY_DATA,
  LOAD_ROOM,
  LOAD_ROOMS,
  CHANGE_SHOW_LOBBY,
} from '../constants';
import socketIOClient from 'socket.io-client';
import { store } from '../index';
import { loadRooms } from '../actions/loadRooms';
import { loadRoom } from '../actions/loadRoom';
import { updateMyData } from '../actions/updateMyData';
import { setTetro } from '../actions/setTetro';
import {
  SET_TETRO,
  MOVE_TETRO,
  MOVE_TETRO_DOWN,
  DROP_TETRO,
  ROTATE_TETR0,
  RIGHT_LIMIT,
  BOTTOM_LIMIT,
  LINE,
  GI,
  GI2,
  SQUARE,
  ZI,
  ZI2,
  TI,
} from '../constants';

const login = 'user';

export const io = socketIOClient({
  query: `login=${login}`,
});

io.on('update-rooms', ({ rooms }) => store.dispatch(loadRooms(rooms)));

io.on('send-room', ({ room }) => {
  console.log('room I joined', room);
  store.dispatch(loadRoom(room));
});

io.on('send-id', ({ id }) => store.dispatch(updateMyData({ id })));

io.on('update-room', ({ room }) => {
  console.log('update room happened');
  store.dispatch(loadRoom(room));
});

io.on('set-tetro', ({ tetro }) => store.dispatch(setTetro(tetro)));

const initialState = {
  rooms: [],
  game: {
    pile: [
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
    ],
    tetro: null,
  },
  showLobby: true,
  socket: io,
  room: null,
  myData: {
    id: null,
  },
};

const wasPileHit = (figure, row, col, pile) => {
  const lastRow = BOTTOM_LIMIT - 1;

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

const isTetroInsideField = (figure, row, col) => {
  for (let rowIndex = 0; rowIndex < figure.length; rowIndex++) {
    for (let colIndex = 0; colIndex < figure[rowIndex].length; colIndex++) {
      const elRow = rowIndex + row;
      const elCol = colIndex + col;

      if (
        figure[rowIndex][colIndex] !== 0 &&
        (elRow < 0 ||
          elRow >= BOTTOM_LIMIT ||
          elCol < 0 ||
          elCol >= RIGHT_LIMIT)
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

const isGameOver = pile => pile[0].some(el => el !== 0);

const getPileWithRemovedRows = pile => {
  const newPile = JSON.parse(JSON.stringify(pile));

  for (let rowIndex = BOTTOM_LIMIT - 1; rowIndex >= 0; rowIndex--) {
    if (newPile[rowIndex].every(el => el !== 0)) {
      newPile.splice(rowIndex, 1);
      newPile.unshift(new Array(10).fill(0));
      rowIndex++;
    }
  }
  return newPile;
};

const getPileWithDropedTetro = (tetro, pile) => {
  const { figure, col, color } = tetro;

  for (let rowIndex = 0; rowIndex < BOTTOM_LIMIT; rowIndex++) {
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

export const allReducers = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ROOM: {
      return { ...state, room: action.payload };
    }
    case UPDATE_MY_DATA: {
      return { ...state, myData: action.payload };
    }
    case LOAD_ROOMS: {
      return { ...state, rooms: action.payload };
    }
    case CHANGE_SHOW_LOBBY: {
      return { ...state, showLobby: action.payload };
    }
    case SET_TETRO: {
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

        if (!isTetroInsideField(state.game.tetro.figure, newRow, newCol)) {
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
        state.socket.emit('get-tetro', {
          roomId: state.room.id,
          playerId: state.myData.id,
        });
        return {
          ...state,
          game: {
            ...state.game,
            pile: getPileWithRemovedRows(
              getPileWithDropedTetro(state.game.tetro, state.game.pile),
            ),
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
          state.socket.emit('get-tetro', {
            roomId: state.room.id,
            playerId: state.myData.id,
          });
          return {
            ...state,
            game: {
              pile: getPileWithRemovedRows(
                getPileWithTetro(state.game.pile, state.game.tetro),
              ),
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
