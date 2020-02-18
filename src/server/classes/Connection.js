const Room = require('./Room');

module.exports = class Connection {
  constructor(io) {
    this.io = io;
    this.rooms = {};
    this.people = {};

    io.use((socket, next) => {
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
    const { roomId, playerName } = socket.request._query;

    if (!roomId && !playerName) {
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

  resetPlayerGames(room) {
    Object.values(room.players).forEach(player => player.init());
  }

  startGame(socket, roomId) {
    const room = this.rooms[roomId];

    if (room && socket.id === room.leader) {
      this.resetPlayerGames(room);
      this.sendRooms();
      room.startGame();
      Object.values(room.players).forEach(player =>
        this.io.to(player.id).emit('set-tetro', { tetro: player.tetro }),
      );
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

    if (player && player.game) {
      player.setTetro();
      this.io.to(playerId).emit('set-tetro', { tetro: player.tetro });
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

  isRoomGameOver(roomId) {
    return Object.values(this.rooms[roomId].players).every(
      player => player.isGameOver,
    );
  }

  resetRoomGame(roomId, newLeader) {
    this.rooms[roomId].game = null;
    this.rooms[roomId].leader = newLeader;
  }

  finishGame(roomId, playerId) {
    const player = this.getRoomPlayer({ roomId, playerId });

    if (player) {
      player.finishGame();
      if (this.isRoomGameOver(roomId)) {
        this.resetRoomGame(roomId, player.id);
      }
      this.sendRoom(roomId);
    }
  }

  disconnect(socket) {
    this.deletePerson(socket);
    Object.keys(this.rooms).map(roomId => {
      const room = this.rooms[roomId];

      room.removePlayer(socket.id);
      socket.leave(roomId);
      if (!Object.keys(room.players).length) {
        return this.deleteRoom(roomId);
      }
      if (room.leader === socket.id) {
        room.setLeader(Object.keys(room.players)[0]);
      }
      this.sendRoom(roomId);
    });
  }
};
