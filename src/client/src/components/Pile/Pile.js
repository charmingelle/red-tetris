import React from 'react';
import { Square } from '../Square';
import { INVISIBLE_ROW_AMOUNT } from '../../constants';

export const Pile = ({ pile, squareWidth }) => {
  return pile
    .slice(INVISIBLE_ROW_AMOUNT)
    .map((row, rowIndex) =>
      row.map((el, colIndex) =>
        el !== 0 ? (
          <Square
            left={colIndex}
            top={rowIndex}
            color={el}
            key={`${rowIndex}+${colIndex}`}
            width={squareWidth}
            borderWidth={squareWidth / 8}
          />
        ) : null,
      ),
    );
};
