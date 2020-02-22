import React from 'react';
import { connect } from 'react-redux';
import './Others.css';
import { Pile } from '../Pile';
import { Penalty } from '../Penalty';
import {
  OTHER_SQUARE_WIDTH,
  WIDTH_IN_SQUARES,
  HEIGHT_IN_SQUARES,
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
      <Pile pile={pile} squareWidth={OTHER_SQUARE_WIDTH} />
      <Penalty startRow={pile.length} squareWidth={OTHER_SQUARE_WIDTH} />
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
