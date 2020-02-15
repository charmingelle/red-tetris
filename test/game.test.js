import {
  wasPileCrossed,
  isTetroOutsideField,
  getRotatedFigure,
  getPileWithTetro,
  getPileWithDropedTetro,
  isGameOver,
} from '../src/client/src/utils/game';

const LINE = [
  [0, 0, 1, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 0],
];
const GI = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 0, 1],
];
const RED = {
  main: '#c00',
  lighter: '#f00',
  darker: '#980000',
};
const EMPTY_PILE = [
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
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const NOT_EMPTY_PILE = [
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
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [RED, RED, RED, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, RED, 0, 0, 0, 0, 0, 0, 0],
];
const GAME_OVER_PILE = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, RED, RED, RED, RED, 0, 0, 0],
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
  [RED, RED, RED, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, RED, 0, 0, 0, 0, 0, 0, 0],
];

describe('Game', () => {
  test('wasPileCrossed', () => {
    expect(wasPileCrossed(LINE, 0, 0, EMPTY_PILE)).toBe(false);
    expect(wasPileCrossed(LINE, 20, 0, EMPTY_PILE)).toBe(true);
    expect(wasPileCrossed(LINE, 17, 0, NOT_EMPTY_PILE)).toBe(false);
    expect(wasPileCrossed(LINE, 18, 0, NOT_EMPTY_PILE)).toBe(true);
  });

  test('isTetroOutsideField', () => {
    expect(isTetroOutsideField(LINE, -1, 0, EMPTY_PILE)).toBe(true);
    expect(isTetroOutsideField(LINE, 0, -3, EMPTY_PILE)).toBe(true);
    expect(isTetroOutsideField(LINE, 20, 0, EMPTY_PILE)).toBe(true);
    expect(isTetroOutsideField(LINE, 0, 8, EMPTY_PILE)).toBe(true);
    expect(isTetroOutsideField(LINE, 10, 3, EMPTY_PILE)).toBe(false);
  });

  test('getRotatedFigure', () => {
    expect(
      getRotatedFigure([
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ]),
    ).toEqual([
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    expect(
      getRotatedFigure([
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ]),
    ).toEqual([
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ]);
  });

  test('getPileWithTetro', () => {
    expect(
      getPileWithTetro(
        {
          figure: GI,
          row: 20,
          col: 0,
          color: RED,
        },
        EMPTY_PILE,
      ),
    ).toEqual(NOT_EMPTY_PILE);
  });

  test('getPileWithDropedTetro', () => {
    expect(
      getPileWithDropedTetro(
        {
          figure: GI,
          row: 0,
          col: 0,
          color: RED,
        },
        EMPTY_PILE,
      ),
    ).toEqual(NOT_EMPTY_PILE);
  });

  test('isGameOver', () => {
    expect(
      isGameOver({ figure: LINE, row: 0, col: 0, color: RED }, EMPTY_PILE),
    ).toBe(false);
    expect(
      isGameOver({ figure: LINE, row: 0, col: 3, color: RED }, GAME_OVER_PILE),
    ).toBe(true);
  });
});
