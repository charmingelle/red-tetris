import React from 'react';
import { Square } from '../Square';
import { connect } from 'react-redux';

export const TetrominoInner = ({ figure, row, col, color }) => {
  const squares = [];

  figure.map((figureRow, figureRowIndex) =>
    figureRow.forEach((figureEl, figureColIndex) => {
      if (figureEl !== 0) {
        squares.push(
          <Square
            left={figureColIndex + col}
            top={figureRowIndex + row}
            color={color}
            key={`${figureRowIndex}-${figureColIndex}`}
          />,
        );
      }
    }),
  );
  return <>{squares}</>;
};

const mapStateToProps = ({
  game: {
    tetro: { figure, row, col, color },
  },
}) => ({ figure, row, col, color });

export const Tetromino = connect(mapStateToProps)(TetrominoInner);
