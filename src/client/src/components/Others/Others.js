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

const OthersInner = ({ others }) => (
  <ul className="others">
    {Object.keys(others).map(playerId => (
      <li key={playerId} className="other">
        {renderOtherPile(others[playerId])}
        <div className="score">{`${playerId}: 0`}</div>
      </li>
    ))}
  </ul>
);

const mapStateToProps = ({ others }) => ({ others });

export const Others = connect(mapStateToProps)(OthersInner);
