const express = require('express');
const app = express();
const post = 5000;
const http = app.listen(post, () =>
  console.log(`Server is running on port ${5000}`),
);

const LINE = [
  [0, 0, 1, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 0],
];
const GI = [
  [1, 1, 1],
  [0, 0, 1],
  [0, 0, 0],
];
const GI2 = [
  [1, 1, 1],
  [1, 0, 0],
  [0, 0, 0],
];
const SQUARE = [
  [1, 1],
  [1, 1],
];
const ZI = [
  [1, 1, 0],
  [0, 1, 1],
  [0, 0, 0],
];
const ZI2 = [
  [0, 1, 1],
  [1, 1, 0],
  [0, 0, 0],
];
const TI = [
  [1, 1, 1],
  [0, 1, 0],
  [0, 0, 0],
];

const RED = {
  main: '#c00',
  lighter: '#f00',
  darker: '#980000',
};
const ORANGE = {
  main: '#f77700',
  lighter: '#f7923a',
  darker: '#9b4e00',
};
const YELLOW = {
  main: '#cccc00',
  lighter: '#feff00',
  darker: '#9a9800',
};
const GREEN = {
  main: '#129c0a',
  lighter: '#3bd652',
  darker: '#077001',
};
const BLUE = {
  main: '#06cccc',
  lighter: '#0cffff',
  darker: '#108d8e',
};
const PURPLE = {
  main: '#0d05f3',
  lighter: '#3033f2',
  darker: '#020279',
};
const VIOLET = {
  main: '#9901cc',
  lighter: '#cc02ff',
  darker: '#660099',
};

class Player {
  constructor({ io, id, name }) {
    this.io = io;
    this.id = id;
    this.name = name;
    this.pile = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.tetroIndex = -1;
    this.tetro = null;
    this.game = null;
    this.score = 0;
    this.isGameOver = false;
  }

  setGame(game) {
    this.game = game;
  }

  setTetro() {
    if (!this.isGameOver) {
      this.tetroIndex += 1;
      this.tetro = this.game.getTetro(this.tetroIndex);
      this.io.to(this.id).emit('set-tetro', { tetro: this.tetro });
    }
  }

  setPile(pile) {
    this.pile = pile;
  }

  increaseScore(points) {
    this.score += points;
  }

  receivePenalty(penalty) {
    const newPile = JSON.parse(JSON.stringify(this.pile));

    for (let i = 0; i < penalty; i++) {
      newPile.shift(penalty);
    }
    this.pile = newPile;
  }

  finishGame() {
    this.isGameOver = true;
  }

  getScore() {
    return this.score;
  }

  getPlayerData() {
    return {
      id: this.id,
      name: this.name,
      pile: this.pile,
      tetro: this.tetro,
      score: this.score,
      isGameOver: this.isGameOver,
    };
  }
}

class Game {
  constructor(room) {
    this.room = room;
    this.tetros = [this.getRandomTetro()];

    Object.values(this.room.players).forEach(player => {
      player.setGame(this);
      player.setTetro();
    });
  }

  getTetro(tetroIndex) {
    if (this.tetros[tetroIndex]) {
      return this.tetros[tetroIndex];
    }
    this.tetros = [...this.tetros, this.getRandomTetro()];
    return this.tetros[tetroIndex];
  }

  getRandomTetro() {
    const figures = [LINE, GI, GI2, SQUARE, ZI, ZI2, TI];
    const colors = [RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE, VIOLET];
    const randomFigureIndex = Math.floor(Math.random() * figures.length);
    const randomColorIndex = Math.floor(Math.random() * colors.length);

    return {
      figure: figures[randomFigureIndex],
      row: 0,
      col: 4,
      color: colors[randomColorIndex],
    };
  }

  getGameData() {
    const clientPlayers = {};

    Object.keys(this.room.players).map(
      playerId =>
        (clientPlayers[playerId] = this.room.players[playerId].getPlayerData()),
    );

    return {
      players: clientPlayers,
      tetro: this.tetros[this.tetros.length - 1],
    };
  }
}

class Room {
  constructor({ io, id, leader, players = {} }) {
    this.io = io;
    this.id = id;
    this.leader = leader;
    this.players = players;
    this.game = null;
  }

  addPlayer(playerId, playerName) {
    this.players[playerId] = new Player({
      io: this.io,
      id: playerId,
      name: playerName,
    });
  }

  removePlayer(playerId) {
    delete this.players[playerId];
  }

  setLeader(leader) {
    this.leader = leader;
  }

  startGame() {
    this.game = new Game(this);
  }

  endGame() {
    this.game = null;
  }

  getRoomData() {
    const clientPlayers = {};

    Object.keys(this.players).map(
      playerId =>
        (clientPlayers[playerId] = this.players[playerId].getPlayerData()),
    );
    return {
      id: this.id,
      leader: this.leader,
      players: clientPlayers,
      game: this.game ? this.game.getGameData() : null,
    };
  }
}

class RedTetris {
  constructor(io) {
    this.io = io;
    this.rooms = {};
    this.people = {};

    io.use((socket, next) => {
      console.log(socket.id);
      next();
    });

    io.on('connection', socket => {
      this.sendLobbyOrRoom(socket);

      socket.on('set-name', ({ name }) => this.addPerson(socket, name));
      socket.on('create-room', ({ roomId }) => this.createRoom(socket, roomId));
      socket.on('join-room', ({ roomId }) => this.joinRoom(socket, roomId));
      socket.on('start-game', ({ roomId }) => this.startGame(socket, roomId));
      socket.on('get-tetro', ({ roomId, playerId }) =>
        this.getTetro(roomId, playerId),
      );
      socket.on('set-pile', ({ roomId, playerId, pile }) =>
        this.setPile(roomId, playerId, pile),
      );
      socket.on('increase-score', ({ roomId, playerId, points }) =>
        this.increaseScore(roomId, playerId, points),
      );
      socket.on('finish-game', ({ roomId, playerId }) =>
        this.finishGame(roomId, playerId),
      );
      socket.on('disconnect', () => this.disconnect(socket));
    });
  }

  sendLobbyOrRoom(socket) {
    const { anonymous, roomId, playerName } = socket.request._query;

    if (anonymous) {
      return this.sendInitialData(socket);
    }
    this.people[socket.id] = playerName;
    if (!this.isExistingRoom(roomId)) {
      this.createRoom(socket, roomId);
    }
    if (!this.isPlayerInTheRoom(socket.id, roomId)) {
      return this.joinRoom(socket, roomId);
    }
    this.sendInitialData(socket);
  }

  sendInitialData(socket) {
    this.sendId(socket);
    this.sendRoomsToMe(socket);
    this.sendMyRoomIdToMe(socket);
    this.sendPeople();
  }

  isExistingRoom(roomId) {
    return this.rooms[roomId] !== undefined;
  }

  isPlayerInTheRoom(playerId, roomId) {
    return Object.keys(this.rooms[roomId].players).includes(playerId);
  }

  getMyRoomId(playerId) {
    return Object.keys(this.rooms).find(roomId =>
      Object.keys(this.rooms[roomId].players).includes(playerId),
    );
  }

  sendMyRoomIdToMe(socket) {
    this.io.to(socket.id).emit('update-my-room-id', {
      myRoomId: this.getMyRoomId(socket.id),
    });
  }

  addPerson(socket, name) {
    this.people[socket.id] = name;
    this.sendPeople();
  }

  deletePerson(socket) {
    delete this.people[socket.id];
    this.sendPeople();
  }

  sendId(socket) {
    this.io.to(socket.id).emit('send-id', {
      id: socket.id,
    });
  }

  getClientRooms() {
    const clientRooms = {};

    Object.keys(this.rooms).forEach(
      roomId => (clientRooms[roomId] = this.rooms[roomId].getRoomData()),
    );
    return clientRooms;
  }

  sendRoomsToMe(socket) {
    this.io.to(socket.id).emit('update-rooms', {
      rooms: this.getClientRooms(),
    });
  }

  sendPeople() {
    this.io.emit('update-people', {
      people: this.people,
    });
  }

  sendRooms() {
    this.io.emit('update-rooms', {
      rooms: this.getClientRooms(),
    });
  }

  getNewRoomId() {
    return Object.keys(this.rooms).length
      ? Math.max(...Object.keys(this.rooms).map(roomId => parseInt(roomId))) +
          1 +
          ''
      : '0';
  }

  sendRoom(roomId) {
    this.io.to(roomId).emit('update-room', {
      room: this.rooms[roomId].getRoomData(),
    });
  }

  createRoom(socket, roomId) {
    this.rooms[roomId] = new Room({
      io: this.io,
      id: roomId,
      leader: socket.id,
      players: {},
    });
    this.sendRooms();
  }

  joinRoom(socket, roomId) {
    const room = this.rooms[roomId];

    if (room && !room.game) {
      room.addPlayer(socket.id, this.people[socket.id]);
      socket.join(roomId);
      this.sendInitialData(socket);
      this.sendRoom(roomId);
      this.sendRooms();
    }
  }

  deleteRoom(roomId) {
    delete this.rooms[roomId];
    this.sendRooms();
  }

  startGame(socket, roomId) {
    const room = this.rooms[roomId];

    if (room && socket.id === room.leader) {
      room.startGame();
      this.sendRoom(roomId);
      this.sendRooms();
    }
  }

  getRoomPlayer({ roomId, playerId }) {
    const room = this.rooms[roomId];

    if (room) {
      const player = room.players[playerId];

      if (player) {
        return player;
      }
    }
    return null;
  }

  getTetro(roomId, playerId) {
    const player = this.getRoomPlayer({ roomId, playerId });

    if (player) {
      player.setTetro();
    }
  }

  setPile(roomId, playerId, pile) {
    const player = this.getRoomPlayer({ roomId, playerId });

    if (player) {
      player.setPile(pile);
      this.sendRoom(roomId);
    }
  }

  increaseScore(roomId, playerId, points) {
    const player = this.getRoomPlayer({ roomId, playerId });

    if (player) {
      const otherPlayerIds = Object.keys(this.rooms[roomId].players).filter(
        id => id !== playerId,
      );

      player.increaseScore(points);
      otherPlayerIds.forEach(id =>
        this.rooms[roomId].players[id].receivePenalty(points),
      );
      this.sendRoom(roomId);
    }
  }

  finishGame(roomId, playerId) {
    const player = this.getRoomPlayer({ roomId, playerId });

    if (player) {
      player.finishGame();
      this.sendRoom(roomId);
    }
  }

  disconnect(socket) {
    this.deletePerson(socket);
    Object.keys(this.rooms).map(roomId => {
      const room = this.rooms[roomId];
      const playerToRemove = this.getRoomPlayer({
        roomId,
        playerId: socket.id,
      });

      if (playerToRemove) {
        room.removePlayer(socket.id);
        socket.leave(roomId);
        if (room.leader === socket.id && Object.keys(room.players).length) {
          room.setLeader(Object.keys(room.players)[0]);
        }
        this.sendRoom(roomId);
        if (!Object.keys(room.players).length) {
          this.deleteRoom(roomId);
        }
      }
    });
  }
}

new RedTetris(require('socket.io')(http));
