import React from 'react';
import { connect } from 'react-redux';
import './Others.css';
import { Square } from '../Square';
import {
  OTHER_SHIFT,
  BOTTOM_LIMIT,
  RIGHT_LIMIT,
  PENALTY_COLOR,
} from '../../constants';

const renderOtherPenalty = startRow => {
  const penaltyRows = [];

  for (let rowIndex = startRow; rowIndex < BOTTOM_LIMIT; rowIndex++) {
    for (let colIndex = 0; colIndex < RIGHT_LIMIT; colIndex++) {
      penaltyRows.unshift(
        <Square
          left={colIndex}
          top={rowIndex}
          color={PENALTY_COLOR}
          key={`${rowIndex}+${colIndex}`}
          shift={OTHER_SHIFT}
        />,
      );
    }
  }
  return <>{penaltyRows}</>;
};

const renderOtherPile = pile => (
  <div className="other-pile">
    {pile.map((row, rowIndex) =>
      row.map((el, colIndex) =>
        el !== 0 ? (
          <Square
            left={colIndex}
            top={rowIndex}
            color={el}
            key={`${rowIndex}+${colIndex}`}
            shift={OTHER_SHIFT}
          />
        ) : null,
      ),
    )}
    {renderOtherPenalty(pile.length)}
  </div>
);

const OthersInner = ({ myId, players }) => (
  <ul className="others">
    {players
      .filter(({ id }) => id !== myId)
      .map(({ id, pile, score }) => (
        <li key={id} className="other">
          {renderOtherPile(pile)}
          <div className="score">{`${id}: ${score}`}</div>
        </li>
      ))}
  </ul>
);

const mapStateToProps = ({ myData: { id: myId }, room: { players } }) => ({
  myId,
  players,
});

export const Others = connect(mapStateToProps)(OthersInner);
