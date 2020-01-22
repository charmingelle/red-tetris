import React from 'react';
import { connect } from 'react-redux';
import './Others.css';
import { Square } from '../Square';
import { OTHER_SHIFT } from '../../constants';

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
