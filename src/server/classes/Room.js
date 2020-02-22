const Player = require('./Player');
const Game = require('./Game');

module.exports = class Room {
  constructor({ id, leader, players = {}, io, pubSub }) {
    this.id = id;
    this.leader = leader;
    this.players = players;
    this.game = null;
    this.io = io;
    this.pubSub = pubSub;
    this.pubSub.subscribe(`disconnect-player-${this.id}`, playerId => {
      this.removePlayer(playerId);
      if (!Object.keys(this.players).length) {
        return this.pubSub.publish('delete-room', this.id);
      }
      if (this.leader === playerId) {
        this.setLeader(Object.keys(this.players)[0]);
      }
      this.send();
    });
  }

  getPlayerTetro(playerId) {
    this.players[playerId].setTetro();
  }

  setPlayerPile(playerId, pile) {
    this.players[playerId].setPile(pile);
    this.send();
  }

  increasePlayerScore(playerId, points) {
    this.players[playerId].increaseScore(points);
    Object.values(this.players)
      .filter(({ id }) => id !== playerId)
      .forEach(player => player.receivePenalty(points));
    this.send();
  }

  finishPlayerGame(playerId) {
    this.players[playerId].finishGame();
    if (this.isGameOver()) {
      this.game = null;
      this.leader = playerId;
    }
    this.send();
  }

  send() {
    this.io.in(this.id).emit('update-room', { room: this.getRoomData() });
  }

  isGameOver() {
    return Object.values(this.players).every(player => player.isGameOver);
  }

  addPlayer(playerId, playerName) {
    this.players[playerId] = new Player({
      id: playerId,
      name: playerName,
      roomId: this.id,
      io: this.io,
      pubSub: this.pubSub,
    });
  }

  removePlayer(playerId) {
    delete this.players[playerId];
  }

  setLeader(leader) {
    this.leader = leader;
  }

  startGame() {
    this.resetPlayerGames();
    this.game = new Game(this);
    Object.values(this.players).forEach(player => {
      player.setGame(this.game);
    });
    this.send();
    Object.values(this.players).forEach(player => {
      player.setTetro();
    });
  }

  endGame() {
    this.game = null;
  }

  resetPlayerGames() {
    Object.values(this.players).forEach(player => player.init());
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
};
