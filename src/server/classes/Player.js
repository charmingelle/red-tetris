const { PILE } = require('../constants/shapes');

module.exports = class Player {
  constructor({ id, name, roomId, io, pubSub }) {
    this.id = id;
    this.name = name;
    this.roomId = roomId;
    this.io = io;
    this.pubSub = pubSub;
    this.init();
    this.pubSub.subscribe(`disconnect-${this.id}`, () =>
      this.pubSub.publish(`disconnect-player-${this.roomId}`, this.id),
    );
  }

  init() {
    this.pile = PILE;
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
      this.io.to(this.id).emit('update-tetro', { tetro: this.tetro });
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
};
