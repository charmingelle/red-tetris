import React from 'react';
import { connect } from 'react-redux';
import './Others.css';
import { Square } from '../Square';
import {
  OTHER_SQUARE_WIDTH,
  WIDTH_IN_SQUARES,
  HEIGHT_IN_SQUARES,
  BOTTOM_LIMIT,
  RIGHT_LIMIT,
  PENALTY_COLOR,
  INVISIBLE_ROW_AMOUNT,
} from '../../constants';

const renderOtherGameOver = () => (
  <div
    className="other-game-over"
    style={{
      width: `${OTHER_SQUARE_WIDTH * WIDTH_IN_SQUARES}px`,
      height: `${OTHER_SQUARE_WIDTH * HEIGHT_IN_SQUARES}px`,
    }}
  >
    GAME OVER
  </div>
);

const renderOtherPenalty = startRow => {
  const penaltyRows = [];

  for (let rowIndex = startRow; rowIndex < BOTTOM_LIMIT; rowIndex++) {
    for (let colIndex = 0; colIndex < RIGHT_LIMIT; colIndex++) {
      penaltyRows.unshift(
        <Square
          left={colIndex}
          top={rowIndex - INVISIBLE_ROW_AMOUNT}
          color={PENALTY_COLOR}
          key={`${rowIndex}+${colIndex}`}
          shift={OTHER_SQUARE_WIDTH}
          borderWidth={OTHER_SQUARE_WIDTH / 8}
        />,
      );
    }
  }
  return <>{penaltyRows}</>;
};

const renderOtherPile = pile =>
  pile
    .slice(INVISIBLE_ROW_AMOUNT)
    .map((row, rowIndex) =>
      row.map((el, colIndex) =>
        el !== 0 ? (
          <Square
            left={colIndex}
            top={rowIndex}
            color={el}
            key={`${rowIndex}+${colIndex}`}
            shift={OTHER_SQUARE_WIDTH}
            borderWidth={OTHER_SQUARE_WIDTH / 8}
          />
        ) : null,
      ),
    );

const renderOtherGame = (pile, isGameOver) =>
  isGameOver ? (
    renderOtherGameOver()
  ) : (
    <div
      className="other-pile"
      style={{
        width: `${OTHER_SQUARE_WIDTH * WIDTH_IN_SQUARES}px`,
        height: `${OTHER_SQUARE_WIDTH * HEIGHT_IN_SQUARES}px`,
      }}
    >
      {renderOtherPile(pile)}
      {renderOtherPenalty(pile.length)}
    </div>
  );

const OthersInner = ({ myId, players }) => (
  <ul className="others">
    {Object.values(players)
      .filter(({ id }) => id !== myId)
      .map(({ id, name, pile, score, isGameOver }) => (
        <li key={id} className="other">
          {renderOtherGame(pile, isGameOver)}
          <div className="score">{`${name}: ${score}`}</div>
        </li>
      ))}
  </ul>
);

const mapStateToProps = ({ myId, myRoom }) => ({
  myId,
  players: myRoom.players,
});

export const Others = connect(mapStateToProps)(OthersInner);
