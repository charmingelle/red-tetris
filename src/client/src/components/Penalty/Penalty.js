import React from 'react';
import { connect } from 'react-redux';
import { Square } from '../Square';
import {
  BOTTOM_LIMIT,
  RIGHT_LIMIT,
  SHIFT,
  PENALTY_COLOR,
} from '../../constants';

const InnerPenalty = ({ startRow }) => {
  const penaltyRows = [];

  for (let rowIndex = startRow; rowIndex < BOTTOM_LIMIT; rowIndex++) {
    for (let colIndex = 0; colIndex < RIGHT_LIMIT; colIndex++) {
      penaltyRows.unshift(
        <Square
          left={colIndex}
          top={rowIndex}
          color={PENALTY_COLOR}
          key={`${rowIndex}+${colIndex}`}
          shift={SHIFT}
        />,
      );
    }
  }
  return <>{penaltyRows}</>;
};

const mapStateToProps = ({ game: { pile } }) => ({ startRow: pile.length });

export const Penalty = connect(mapStateToProps)(InnerPenalty);
