import React from 'react';
import { connect } from 'react-redux';
import './Game.css';
import { Tetromino } from '../Tetromino';
import {
  moveTetro,
  moveTetroDown,
  dropTetro,
  rotateTetro,
} from '../../actions';
import { LEFT, RIGHT, DOWN, UP } from '../../constants';
import { Pile } from '../Pile';
import { store } from '../../index';
import { Others } from '../Others';
import { Penalty } from '../Penalty';

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

const startGame = (socket, roomId) => () =>
  socket.emit('start-game', {
    roomId,
  });

const renderStartGameButton = (socket, myId, roomId, leader, roomGame) =>
  myId === leader && !roomGame ? (
    <button className="start-game-button" onClick={startGame(socket, roomId)}>
      START
    </button>
  ) : null;

const renderGameDetails = (socket, myId, roomId, leader, roomGame) => (
  <div className="game-details">
    {renderStartGameButton(socket, myId, roomId, leader, roomGame)}
    <Others />
  </div>
);

const renderGameOver = () => <div className="game-over">GAME OVER</div>;

const renderField = (myId, roomGame, score) => (
  <div className="field-container">
    <div className="field" tabIndex={0}>
      {roomGame && (
        <>
          <Tetromino />
          <Pile />
          <Penalty />
          {roomGame.isOver && renderGameOver()}
        </>
      )}
    </div>
    <div className="my-score">{`${myId}: ${score}`}</div>
  </div>
);

const GameInner = ({ socket, myId, roomId, leader, roomGame, score }) => (
  <div className="room">
    {renderField(myId, roomGame, score)}
    <div className="game-details-container">
      {roomId && renderGameDetails(socket, myId, roomId, leader, roomGame)}
    </div>
  </div>
);

const mapStateToProps = ({
  socket,
  myId,
  roomId,
  leader,
  roomGame,
  game: { score },
}) => ({
  socket,
  myId,
  roomId,
  leader,
  roomGame,
  score,
});

export const Game = connect(mapStateToProps)(GameInner);
