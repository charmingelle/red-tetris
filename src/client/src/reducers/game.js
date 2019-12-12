import {
  FILL_PILE,
  MOVE_TETRIMINO,
  DROP_TETROMINO,
  ROTATE_TETRIMINO,
  RIGHT_LIMIT,
  BOTTOM_LIMIT,
  LINE,
  GI,
  GI2,
  SQUARE,
  ZI,
  ZI2,
  TI,
  LINE_TETRO
} from "../constants";

const getNewCoords = (coords, payloadTop, payloadLeft) =>
  coords.map(({ row, col }) => ({
    row: row + payloadTop,
    col: col + payloadLeft
  }));

const wasPileHit = (coords, pile) =>
  coords.some(
    ({ row, col }) => row >= BOTTOM_LIMIT || typeof pile[row][col] === "string"
  );

const areCoordsInField = coords =>
  coords.every(
    ({ row, col }) =>
      row >= 0 && row < BOTTOM_LIMIT && col >= 0 && col < RIGHT_LIMIT
  );

const isGameOver = coords => coords.some(({ row }) => row === 0);

const getFilledRows = pile => {
  const rows = [];

  pile.forEach((row, index) => {
    if (row.every(el => typeof el === "string")) {
      rows.push(index);
    }
  });
  return rows;
};

const getRandomFigure = () => {
  const figures = [LINE, GI, GI2, SQUARE, ZI, ZI2, TI];
  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "violet"
  ];
  const randomFigureIndex = Math.floor(Math.random() * figures.length);
  const randomColorIndex = Math.floor(Math.random() * colors.length);

  return {
    coords: figures[randomFigureIndex],
    color: colors[randomColorIndex]
  };
};

const getBottomCoords = (coords, pile) => {
  let prevCoords = coords;

  for (let top = 0; top < 20; top++) {
    const newCoords = getNewCoords(coords, top, 0);

    if (wasPileHit(newCoords, pile)) {
      return prevCoords;
    }
    prevCoords = newCoords;
  }
  return coords;
};

const getRotatedCoords = coords =>
  coords.map(({ row, col }) => {
    const temp = row;

    return {
      row: col,
      col: temp
    };
  });

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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  tetromino: getRandomFigure()
};

export const game = (state = initialState, action) => {
  switch (action.type) {
    case FILL_PILE: {
      const newPile = JSON.parse(JSON.stringify(state.pile));

      action.payload.coords.forEach(({ row, col }) => (newPile[row][col] = 1));
      return {
        ...state,
        pile: newPile
      };
    }
    case MOVE_TETRIMINO: {
      const newCoords = getNewCoords(
        state.tetromino.coords,
        action.payload.top,
        action.payload.left
      );

      if (wasPileHit(newCoords, state.pile)) {
        const newPile = JSON.parse(JSON.stringify(state.pile));

        state.tetromino.coords.forEach(
          ({ row, col }) => (newPile[row][col] = state.tetromino.color)
        );
        if (isGameOver(state.tetromino.coords)) {
          return initialState;
        }
        const filledRows = getFilledRows(newPile);

        if (filledRows.length) {
          filledRows.forEach(row => newPile.splice(row, 1));
          newPile.unshift(new Array(10).fill(0));
        }
        return {
          ...state,
          pile: newPile,
          tetromino: getRandomFigure()
        };
      } else if (areCoordsInField(newCoords)) {
        return {
          ...state,
          tetromino: { coords: newCoords, color: state.tetromino.color }
        };
      }
      return state;
    }
    case DROP_TETROMINO: {
      return {
        ...state,
        tetromino: {
          coords: getBottomCoords(state.tetromino.coords, state.pile),
          color: state.tetromino.color
        }
      };
    }
    case ROTATE_TETRIMINO: {
      return {
        ...state,
        tetromino: {
          coords: getRotatedCoords(state.tetromino.coords),
          color: state.tetromino.color
        }
      };
    }
    default: {
      return state;
    }
  }
};
