const {
  LINE,
  GI,
  GI_MIRROR,
  SQUARE,
  ZI,
  ZI_MIRROR,
  TI,
} = require('../constants/shapes');
const {
  RED,
  ORANGE,
  YELLOW,
  GREEN,
  BLUE,
  PURPLE,
  VIOLET,
} = require('../constants/colors');

module.exports = class Game {
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
    const figures = [LINE, GI, GI_MIRROR, SQUARE, ZI, ZI_MIRROR, TI];
    const colors = [RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE, VIOLET];
    const randomFigureIndex = Math.floor(Math.random() * figures.length);
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    const randomFigure = figures[randomFigureIndex];

    return {
      figure: randomFigure.shape,
      row: randomFigure.initRow,
      col: 4,
      color: colors[randomColorIndex],
    };
  }

  getGameData() {
    return {
      tetro: this.tetros[this.tetros.length - 1],
    };
  }
};
