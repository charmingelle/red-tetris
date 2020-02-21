const Player = require('./Player');
const Game = require('./Game');

module.exports = class Room {
  constructor({ id, leader, players = {}, pubSub }) {
    this.id = id;
    this.leader = leader;
    this.players = players;
    this.game = null;
    this.pubSub = pubSub;
    this.pubSub.subscribe(`player-game-finish-${this.id}`, playerId => {
      if (this.isGameOver()) {
        console.log('room game is over');
        this.game = null;
        this.leader = playerId;
      }
      this.pubSub.publish('send-room', { roomId: this.id });
    });
  }

  isGameOver() {
    return Object.values(this.players).every(player => player.isGameOver);
  }

  addPlayer(playerId, playerName) {
    this.players[playerId] = new Player({
      id: playerId,
      name: playerName,
      roomId: this.id,
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
