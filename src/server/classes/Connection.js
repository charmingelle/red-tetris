const Room = require('./Room');
const PubSub = require('./PubSub');

module.exports = class Connection {
  constructor(io) {
    this.io = io;
    this.rooms = {};
    this.people = {};
    this.pubSub = new PubSub();

    this.pubSub.subscribe('delete-room', roomId => {
      delete this.rooms[roomId];
      this.sendRoomsToAll();
    });

    this.pubSub.subscribe('increase-person-score', ({ id, score }) => {
      this.people[id].score += score;
      this.sendPeopleToAll();
    });

    io.on('connection', socket => {
      this.sendMyIdToMe(socket);

      const { roomId, playerName, error } = socket.request._query;

      if (roomId && playerName) {
        this.people[socket.id] = { name: playerName, score: 0 };
        this.sendPeopleToAll();
        if (!this.rooms[roomId]) {
          this.createRoom(socket, roomId);
          this.sendRoomsToAll();
        }
        this.joinRoom(socket, roomId);
      }
      if (error) {
        this.sendUrlErrorToMe(socket);
      }

      socket.on('set-name', ({ name }) => {
        this.people[socket.id] = { name, score: 0 };
        this.sendPeopleToAll();
      });
      socket.on('create-room', ({ roomId }) => {
        if (this.isUnknownPerson(socket)) {
          return this.emitResetStoreEvent(socket);
        }
        this.createRoom(socket, roomId);
        this.sendRoomsToAll();
      });
      socket.on('join-room', ({ roomId }) => {
        if (this.isUnknownPerson(socket)) {
          return this.emitResetStoreEvent(socket);
        }
        this.joinRoom(socket, roomId);
        this.sendRoomsToAll();
      });
      socket.on('start-game', ({ roomId }) => {
        if (this.isUnknownPerson(socket)) {
          return this.emitResetStoreEvent(socket);
        }
        this.rooms[roomId].startGame();
        this.sendRoomsToAll();
      });
      socket.on('get-tetro', ({ roomId, playerId }) => {
        if (this.isUnknownPerson(socket)) {
          return this.emitResetStoreEvent(socket);
        }
        this.rooms[roomId].getPlayerTetro(playerId);
      });
      socket.on('set-pile', ({ roomId, playerId, pile }) => {
        if (this.isUnknownPerson(socket)) {
          return this.emitResetStoreEvent(socket);
        }
        this.rooms[roomId].setPlayerPile(playerId, pile);
      });
      socket.on('increase-score', ({ roomId, playerId, points }) => {
        if (this.isUnknownPerson(socket)) {
          return this.emitResetStoreEvent(socket);
        }
        this.rooms[roomId].increasePlayerScore(playerId, points);
      });
      socket.on('finish-game', ({ roomId, playerId }) => {
        if (this.isUnknownPerson(socket)) {
          return this.emitResetStoreEvent(socket);
        }
        this.rooms[roomId].finishPlayerGame(playerId);
        this.sendRoomsToAll();
      });
      socket.on('disconnect', () => {
        this.disconnect(socket);
        this.sendPeopleToAll();
      });
    });
  }

  isUnknownPerson(socket) {
    return this.people[socket.id] === undefined;
  }

  emitResetStoreEvent(socket) {
    return this.io.to(socket.id).emit('reset-store', { id: socket.id });
  }

  createRoom(socket, roomId) {
    this.rooms[roomId] = new Room({
      id: roomId,
      leader: socket.id,
      players: {},
      io: this.io,
      pubSub: this.pubSub,
    });
  }

  joinRoom(socket, roomId) {
    const room = this.rooms[roomId];

    if (room && !room.game) {
      room.addPlayer(socket.id, this.people[socket.id].name);
      socket.join(roomId);
      room.send();
    }
  }

  sendUrlErrorToMe(socket) {
    this.io.to(socket.id).emit('update-url-error');
  }

  sendMyIdToMe(socket) {
    this.io.to(socket.id).emit('update-my-id', {
      id: socket.id,
    });
  }

  sendPeopleToAll() {
    this.io.emit('update-people', {
      people: this.people,
    });
  }

  sendRoomsToAll() {
    const clientRooms = {};

    Object.keys(this.rooms).forEach(
      roomId => (clientRooms[roomId] = this.rooms[roomId].getRoomData()),
    );
    this.io.emit('update-rooms', {
      rooms: clientRooms,
    });
  }

  disconnect(socket) {
    delete this.people[socket.id];
    this.sendPeopleToAll();
    this.pubSub.publish(`disconnect-${socket.id}`);
  }
};
