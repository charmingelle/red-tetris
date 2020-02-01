import React from 'react';
import { connect } from 'react-redux';
import './Room.css';
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

const startGame = (socket, roomId) => () => {
  socket.emit('start-game', {
    roomId,
  });
};

const StartGameButton = ({ socket, myId, roomId, leader, game }) =>
  myId === leader && !game ? (
    <button className="start-game-button" onClick={startGame(socket, roomId)}>
      START
    </button>
  ) : null;

const GameDetails = ({ socket, myId, roomId, leader, game }) =>
  roomId ? (
    <div className="game-details">
      <StartGameButton
        socket={socket}
        myId={myId}
        roomId={roomId}
        leader={leader}
        game={game}
      />
      <Others />
    </div>
  ) : null;

const Game = ({ game }) =>
  game ? (
    <>
      <Tetromino />
      <Pile />
      <Penalty />
      {game.isOver && <div className="game-over">GAME OVER</div>}
    </>
  ) : null;

const Field = ({ myName, game, score }) => (
  <div className="field-container">
    <div className="field" tabIndex={0}>
      <Game game={game} />
    </div>
    <div className="my-score">{`${myName}: ${score}`}</div>
  </div>
);

const RoomInner = ({ socket, myId, roomId, myName, leader, game, score }) => (
  <div className="room">
    <Field myName={myName} game={game} score={score} />
    <div className="game-details-container">
      <GameDetails
        socket={socket}
        myId={myId}
        roomId={roomId}
        leader={leader}
        game={game}
      />
    </div>
  </div>
);

const mapStateToProps = ({ socket, myId, myRoomId, myName, rooms }) => ({
  socket,
  myId,
  roomId: myRoomId,
  myName,
  leader: rooms[myRoomId].leader,
  game: rooms[myRoomId].game,
  score: rooms[myRoomId].players[myId].score,
});

export const Room = connect(mapStateToProps)(RoomInner);
