import { RIGHT_LIMIT } from '../constants';
import { transposeSquareMatrix, reverseSquareMatrixRows } from './common';

export const wasPileCrossed = (figure, row, col, pile) => {
  const lastRow = pile.length - 1;

  for (let i = 0; i < figure.length; i++) {
    for (let j = 0; j < figure[i].length; j++) {
      if (
        figure[i][j] !== 0 &&
        (i + row > lastRow || pile[i + row][j + col] !== 0)
      ) {
        return true;
      }
    }
  }
  return false;
};

export const isTetroOutsideField = (figure, row, col, pile) => {
  for (let i = 0; i < figure.length; i++) {
    for (let j = 0; j < figure[i].length; j++) {
      const elRow = i + row;
      const elCol = j + col;

      if (
        figure[i][j] !== 0 &&
        (elRow < 0 || elRow >= pile.length || elCol < 0 || elCol >= RIGHT_LIMIT)
      ) {
        return true;
      }
    }
  }
  return false;
};

export const cannotMoveTetro = (figure, row, col, pile) =>
  isTetroOutsideField(figure, row, col, pile) ||
  wasPileCrossed(figure, row, col, pile);

export const getRotatedFigure = figure => {
  const rotatedFigure = JSON.parse(JSON.stringify(figure));

  transposeSquareMatrix(rotatedFigure);
  reverseSquareMatrixRows(rotatedFigure);
  return rotatedFigure;
};

export const getPileWithTetro = (tetro, pile) => {
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

export const getPileWithDropedTetro = (tetro, pile) => {
  const { figure, col, color } = tetro;

  for (let rowIndex = 0; rowIndex < pile.length; rowIndex++) {
    if (wasPileCrossed(figure, rowIndex, col, pile)) {
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

export const isGameOver = (newTetro, pile) => {
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

export const getPileWithRemovedRowsAndPoints = pile => {
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
  return { newPile, points };
};

export const removeRows = (pile, state) => {
  const { newPile, points } = getPileWithRemovedRowsAndPoints(pile);

  if (points) {
    increaseMyScore(points, state);
  }
  setMyPile(newPile, state);
};

export const getNewTetro = ({ socket, myRoom, myId }) =>
  socket.emit('get-tetro', {
    roomId: myRoom.id,
    playerId: myId,
  });

export const setMyPile = (pile, { socket, myRoom, myId }) =>
  socket.emit('set-pile', {
    roomId: myRoom.id,
    playerId: myId,
    pile,
  });

export const increaseMyScore = (points, { socket, myRoom, myId }) =>
  socket.emit('increase-score', {
    roomId: myRoom.id,
    playerId: myId,
    points,
  });

export const finishGame = ({ socket, myRoom, myId }) =>
  socket.emit('finish-game', {
    roomId: myRoom.id,
    playerId: myId,
  });
