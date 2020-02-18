import React from 'react';
import { connect } from 'react-redux';
import { Square } from '../Square';
import {
  BOTTOM_LIMIT,
  RIGHT_LIMIT,
  SQUARE_WIDTH,
  PENALTY_COLOR,
  INVISIBLE_ROW_AMOUNT,
} from '../../constants';

const InnerPenalty = ({ startRow }) => {
  const penaltyRows = [];

  for (let rowIndex = startRow; rowIndex < BOTTOM_LIMIT; rowIndex++) {
    for (let colIndex = 0; colIndex < RIGHT_LIMIT; colIndex++) {
      penaltyRows.unshift(
        <Square
          left={colIndex}
          top={rowIndex - INVISIBLE_ROW_AMOUNT}
          color={PENALTY_COLOR}
          key={`${rowIndex}+${colIndex}`}
          shift={SQUARE_WIDTH}
          borderWidth={SQUARE_WIDTH / 8}
        />,
      );
    }
  }
  return <>{penaltyRows}</>;
};

const mapStateToProps = ({ myId, myRoomId, rooms }) => ({
  startRow: rooms[myRoomId].players[myId].pile.length,
});

export const Penalty = connect(mapStateToProps)(InnerPenalty);
