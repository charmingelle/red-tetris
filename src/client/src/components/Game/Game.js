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

const renderPlayers = room =>
  room.players.length === 1 ? <div>You are playing along</div> : <Others />;

const startGame = (socket, room) => () => {
  console.log('start game click', socket, room);
  socket.emit('start-game', {
    roomId: room.id,
  });
};

const renderStartGameButton = (socket, myData, room) =>
  myData.id === room.leader && !room.game ? (
    <button onClick={startGame(socket, room)}>Start Game</button>
  ) : null;

const renderGameStatus = room =>
  room.game ? <div>Game in progress</div> : null;

const renderGameDetails = (socket, myData, room) => (
  <div className="game-details">
    {renderStartGameButton(socket, myData, room)}
    {renderGameStatus(room)}
    {renderPlayers(room)}
  </div>
);

const renderField = () => (
  <div className="field" tabIndex={0}>
    <Tetromino />
    <Pile />
  </div>
);

const GameInner = ({ socket, myData, room }) => (
  <div className="room">
    <div className="field-container">
      <div>{`Hi, ${myData.id}`}</div>
      {renderField()}
    </div>
    <div className="game-details-container">
      {room && renderGameDetails(socket, myData, room)}
    </div>
  </div>
);

const mapStateToProps = ({ socket, myData, room }) => ({
  socket,
  myData,
  room,
});

export const Game = connect(mapStateToProps)(GameInner);
