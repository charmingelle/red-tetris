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

const renderOtherGameOver = () => (
  <div className="other-game-over">GAME OVER</div>
);

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

const renderOtherPile = pile =>
  pile.map((row, rowIndex) =>
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
  );

const renderOtherGame = (pile, isGameOver) =>
  isGameOver ? (
    renderOtherGameOver()
  ) : (
    <div className="other-pile">
      {renderOtherPile(pile)}
      {renderOtherPenalty(pile.length)}
    </div>
  );

const OthersInner = ({ myId, players }) => (
  <ul className="others">
    {Object.values(players)
      .filter(({ id }) => id !== myId)
      .map(({ id, pile, score, isGameOver }) => (
        <li key={id} className="other">
          {renderOtherGame(pile, isGameOver)}
          <div className="score">{`${id}: ${score}`}</div>
        </li>
      ))}
  </ul>
);

const mapStateToProps = ({ myId, players }) => ({
  myId,
  players,
});

export const Others = connect(mapStateToProps)(OthersInner);
