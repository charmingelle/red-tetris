import React from 'react';
import { Square } from '../Square';
import {
  BOTTOM_LIMIT,
  RIGHT_LIMIT,
  PENALTY_COLOR,
  INVISIBLE_ROW_AMOUNT,
} from '../../constants';

export const Penalty = ({ startRow, squareWidth }) => {
  const penaltyRows = [];

  for (let rowIndex = startRow; rowIndex < BOTTOM_LIMIT; rowIndex++) {
    for (let colIndex = 0; colIndex < RIGHT_LIMIT; colIndex++) {
      penaltyRows.unshift(
        <Square
          left={colIndex}
          top={rowIndex - INVISIBLE_ROW_AMOUNT}
          color={PENALTY_COLOR}
          key={`${rowIndex}+${colIndex}`}
          width={squareWidth}
          borderWidth={squareWidth / 8}
        />,
      );
    }
  }
  return penaltyRows;
};
