import React from 'react';
import { connect } from 'react-redux';
import './Room.css';
import { Tetro } from '../Tetro';
import {
  moveTetro,
  moveTetroDown,
  dropTetro,
  rotateTetro,
} from '../../actions';
import {
  LEFT,
  RIGHT,
  SPACE,
  UP,
  DOWN,
  SQUARE_WIDTH,
  WIDTH_IN_SQUARES,
  HEIGHT_IN_SQUARES,
} from '../../constants';
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
      store.dispatch(moveTetro({ left: 0, top: 1 }));
      break;
    }
    case SPACE: {
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

const Game = ({ isMyGameOver, pile }) => (
  <>
    <Tetro />
    <Pile pile={pile} squareWidth={SQUARE_WIDTH} />
    <Penalty startRow={pile.length} squareWidth={SQUARE_WIDTH} />
    {isMyGameOver && <div className="game-over">GAME OVER</div>}
  </>
);

const Field = ({ myName, score, isMyGameOver, pile }) => {
  return (
    <div className="field-container">
      <div
        className="field"
        tabIndex={0}
        style={{
          width: `${SQUARE_WIDTH * WIDTH_IN_SQUARES}px`,
          height: `${SQUARE_WIDTH * HEIGHT_IN_SQUARES}px`,
        }}
      >
        <Game isMyGameOver={isMyGameOver} pile={pile} />
      </div>
      <div className="my-score">{`${myName}: ${score}`}</div>
    </div>
  );
};

const RoomInner = ({
  socket,
  myId,
  roomId,
  myName,
  leader,
  game,
  score,
  isMyGameOver,
  pile,
}) => {
  return (
    <div className="room">
      <Field
        myName={myName}
        score={score}
        isMyGameOver={isMyGameOver}
        pile={pile}
      />
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
};

const mapStateToProps = ({ socket, myId, myRoom, myName }) => {
  return {
    socket,
    myId,
    roomId: myRoom.id,
    myName,
    leader: myRoom.leader,
    game: myRoom.game,
    score: myRoom.players[myId].score,
    isMyGameOver: myRoom.players[myId].isGameOver,
    pile: myRoom.players[myId].pile,
  };
};

export const Room = connect(mapStateToProps)(RoomInner);
