import {
  isNameValid,
  getRoomIdAndPlayerName,
  transposeSquareMatrix,
  reverseSquareMatrixRows,
} from './common';

describe('Utils', () => {
  test('isNameValid', () => {
    expect(isNameValid('_aNNa-123_')).toBe(true);
    expect(isNameValid('')).toBe(false);
    expect(isNameValid('John Doe')).toBe(false);
  });

  test('getRoomIdAndPlayerName', () => {
    expect(getRoomIdAndPlayerName('#room1[player1]')).toEqual({
      roomId: 'room1',
      playerName: 'player1',
    });
    expect(getRoomIdAndPlayerName('#room1player1')).toEqual({ error: true });
    expect(getRoomIdAndPlayerName('#room1[player1')).toEqual({ error: true });
    expect(getRoomIdAndPlayerName('#room1player1]')).toEqual({ error: true });
    expect(getRoomIdAndPlayerName('#room+1[player+1]')).toEqual({
      error: true,
    });
    expect(getRoomIdAndPlayerName('#')).toEqual({ error: true });
    expect(getRoomIdAndPlayerName('')).toEqual(null);
  });

  test('transposeSquareMatrix', () => {
    const matrix = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];

    transposeSquareMatrix(matrix);
    expect(matrix).toEqual([[0, 3, 6], [1, 4, 7], [2, 5, 8]]);
  });

  test('reverseSquareMatrixRows', () => {
    const matrix = [[0, 0, 0, 0], [1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3]];

    reverseSquareMatrixRows(matrix);
    expect(matrix).toEqual([
      [3, 3, 3, 3],
      [2, 2, 2, 2],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ]);
  });
});
