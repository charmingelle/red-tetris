const { PILE } = require('../constants/shapes');

module.exports = class Player {
  constructor({ id, name, roomId, pubSub }) {
    this.id = id;
    this.name = name;
    this.roomId = roomId;
    this.pubSub = pubSub;
    this.init();
    this.pubSub.subscribe(`get-tetro-${this.roomId}-${this.id}`, () => {
      this.setTetro();
      this.pubSub.publish('set-tetro', {
        playerId: this.id,
        tetro: this.tetro,
      });
    });
    this.pubSub.subscribe(`set-pile-${this.roomId}-${this.id}`, pile => {
      this.setPile(pile);
      this.pubSub.publish('send-room', { roomId });
    });
    this.pubSub.subscribe(
      `increase-score-${this.roomId}-${this.id}`,
      points => {
        this.increaseScore(points);
        this.pubSub.publish('send-room', { roomId });
      },
    );
    this.pubSub.subscribe(
      `receive-penalty-${this.roomId}-${this.id}`,
      points => {
        this.receivePenalty(points);
        this.pubSub.publish('send-room', { roomId });
      },
    );
    this.pubSub.subscribe(`finish-game-${this.roomId}-${this.id}`, () => {
      this.finishGame();
      this.pubSub.publish(`player-game-finish-${this.roomId}`, this.id);
    });
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
