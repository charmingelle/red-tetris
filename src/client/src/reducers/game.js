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

const getRandomTetro = () => {
  const figures = [LINE, GI, GI2, SQUARE, ZI, ZI2, TI];
  const colors = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'violet',
  ];
  const randomFigureIndex = Math.floor(Math.random() * figures.length);
  const randomColorIndex = Math.floor(Math.random() * colors.length);

  return {
    figure: figures[randomFigureIndex],
    row: 0,
    col: 4,
    color: colors[randomColorIndex],
  };
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  tetro: null,
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

export const game = (state = initialState, action) => {
  if (action.type === SET_TETRO) {
    return {
      ...state,
      tetro: action.payload,
    };
  }
  if (state.tetro) {
    const {
      tetro: { figure, row, col, color },
      pile,
    } = state;

    if (isGameOver(pile)) {
      return initialState;
    }

    switch (action.type) {
      case SET_TETRO: {
        return {
          ...state,
          tetro: action.payload,
        };
      }
      case MOVE_TETRO: {
        const newRow = row + action.payload.top;
        const newCol = col + action.payload.left;

        if (!isTetroInsideField(figure, newRow, newCol)) {
          return state;
        }
        if (wasPileHit(figure, newRow, newCol, pile)) {
          return state;
        }
        return {
          ...state,
          tetro: {
            figure,
            row: newRow,
            col: newCol,
            color,
          },
        };
      }
      case DROP_TETRO: {
        return {
          ...state,
          pile: getPileWithRemovedRows(
            getPileWithDropedTetro(state.tetro, pile),
          ),
          tetro: getRandomTetro(),
        };
      }
      case ROTATE_TETR0: {
        const rotatedFigure = getRotatedFigure(figure);

        if (!isTetroInsideField(rotatedFigure, row, col)) {
          return state;
        }
        if (wasPileHit(rotatedFigure, row, col, pile)) {
          return state;
        }
        return {
          ...state,
          tetro: {
            ...state.tetro,
            figure: rotatedFigure,
          },
        };
      }
      case MOVE_TETRO_DOWN: {
        const newRow = row + 1;

        if (wasPileHit(figure, newRow, col, pile)) {
          return {
            ...state,
            pile: getPileWithRemovedRows(getPileWithTetro(pile, state.tetro)),
            tetro: getRandomTetro(),
          };
        } else {
          return {
            ...state,
            tetro: {
              figure,
              row: newRow,
              col,
              color,
            },
          };
        }
      }
      default: {
        return state;
      }
    }
  }
  return state;
};
