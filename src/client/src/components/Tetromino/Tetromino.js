import React from 'react';
import { Square } from '../Square';
import { connect } from 'react-redux';
import { SQUARE_WIDTH, INVISIBLE_ROW_AMOUNT } from '../../constants';

export const TetrominoInner = ({ tetro }) => {
  if (tetro) {
    const { figure, row, col, color } = tetro;
    const squares = [];

    figure.map((figureRow, figureRowIndex) =>
      figureRow.forEach((figureEl, figureColIndex) => {
        const squareRowIndex = figureRowIndex + row;

        if (figureEl !== 0 && squareRowIndex >= INVISIBLE_ROW_AMOUNT) {
          squares.push(
            <Square
              left={figureColIndex + col}
              top={squareRowIndex - INVISIBLE_ROW_AMOUNT}
              color={color}
              key={`${figureRowIndex}-${figureColIndex}`}
              shift={SQUARE_WIDTH}
              borderWidth={SQUARE_WIDTH / 8}
            />,
          );
        }
      }),
    );
    return <>{squares}</>;
  }
  return null;
};

const mapStateToProps = ({ tetro }) => ({ tetro });

export const Tetromino = connect(mapStateToProps)(TetrominoInner);
