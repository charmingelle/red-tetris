import React from 'react';
import './Game.css';
import { Tetromino } from '../Tetromino';
import { moveTetro } from '../../actions/moveTetro';
import { moveTetroDown } from '../../actions/moveTetroDown';
import { dropTetro } from '../../actions/dropTetro';
import { rotateTetro } from '../../actions/rotateTetro';
import { LEFT, RIGHT, DOWN, UP } from '../../constants';
import { Pile } from '../Pile';
import { store } from '../../index';

const keyDownHandler = ({ key }) => {
  switch (key) {
    case LEFT: {
      store.dispatch(moveTetro({ left: -1, top: 0 }));
      break;
    }
    case RIGHT: {
      store.dispatch(moveTetro({ left: 1, top: 0 }));
      break;
    }
    case UP: {
      store.dispatch(rotateTetro());
      break;
    }
    case DOWN: {
      store.dispatch(dropTetro());
      break;
    }
    default: {
      return null;
    }
  }
};

window.setInterval(() => store.dispatch(moveTetroDown()), 750);

window.addEventListener('keydown', keyDownHandler);

export const Game = () => (
  <div className="game">
    <div className="me" tabIndex={0}>
      <Tetromino />
      <Pile />
    </div>
    <div className="you"></div>
  </div>
);
