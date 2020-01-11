import React from 'react';
import { Square } from '../Square';
import { connect } from 'react-redux';

export const TetrominoInner = ({ tetro }) => {
  if (tetro) {
    const { figure, row, col, color } = tetro;
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
  }
  return null;
};

const mapStateToProps = ({ game: { tetro } }) => ({ tetro });

export const Tetromino = connect(mapStateToProps)(TetrominoInner);
