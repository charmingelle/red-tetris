import {
  wasPileCrossed,
  isTetroOutsideField,
  getRotatedFigure,
  getPileWithTetro,
  getPileWithDropedTetro,
  isGameOver,
  getPileWithRemovedRowsAndPoints,
} from './game';
import {
  RED,
  LINE,
  GI,
  EMPTY_PILE,
  NOT_EMPTY_PILE,
  GAME_OVER_PILE,
  PILE_WITH_ROWS_TO_REMOVE,
} from '../mocks';

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

  test('getPileWithRemovedRowsAndPoints: 0 rows to remove', () => {
    const { newPile, points } = getPileWithRemovedRowsAndPoints(NOT_EMPTY_PILE);

    expect(newPile).toEqual(NOT_EMPTY_PILE);
    expect(points).toBe(0);
  });

  test('getPileWithRemovedRowsAndPoints: 2 rows to remove', () => {
    const { newPile, points } = getPileWithRemovedRowsAndPoints(
      PILE_WITH_ROWS_TO_REMOVE,
    );

    expect(newPile).toEqual(NOT_EMPTY_PILE);
    expect(points).toBe(2);
  });
});
