const Player = require('./Player');
const Game = require('./Game');

module.exports = class Room {
  constructor({ id, leader, players = {} }) {
    this.id = id;
    this.leader = leader;
    this.players = players;
    this.game = null;
  }

  addPlayer(playerId, playerName) {
    this.players[playerId] = new Player({
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
};
