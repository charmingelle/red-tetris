import {
  FILL_PILE,
  MOVE_TETRIMINO,
  RIGHT_LIMIT,
  BOTTOM_LIMIT
} from "../constants";

const getNewCoords = (coords, payloadTop, payloadLeft) =>
  coords.map(({ row, col }) => ({
    row: row + payloadTop,
    col: col + payloadLeft
  }));

const areCoordsValid = (coords, pile) =>
  coords.every(
    ({ row, col }) =>
      row >= 0 &&
      row < BOTTOM_LIMIT &&
      col >= 0 &&
      col < RIGHT_LIMIT &&
      pile[row][col] === 0
  );

const initialState = {
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
    [0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 0, 1, 1, 0, 1, 1]
  ],
  tetromino: {
    coords: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 3, col: 0 }
    ]
  }
};

export const game = (state = initialState, action) => {
  switch (action.type) {
    case FILL_PILE: {
      const newState = JSON.parse(JSON.stringify(state));

      action.payload.coords.forEach(
        ({ row, col }) => (newState.pile[row][col] = 1)
      );
      return newState;
    }
    case MOVE_TETRIMINO: {
      const newCoords = getNewCoords(
        state.tetromino.coords,
        action.payload.top,
        action.payload.left
      );

      return areCoordsValid(newCoords, state.pile)
        ? { ...state, tetromino: { coords: newCoords } }
        : state;
    }
    default: {
      return state;
    }
  }
};
