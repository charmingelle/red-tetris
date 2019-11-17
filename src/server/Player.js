const Piece = require('Piece.js');

const BOARD_WIDTH = 10;

const BOARD_HEIGHT = 20;

class Player {
  constructor() {
    this.id = 0;
    this.name = '';
    this.currentScore = 0;
    this.board = this.initiateBoard();
  }

  initiateBoard = () => {
    for (let i = 0; i < BOARD_WIDTH; i++) {
      for (let j = 0; j < BOARD_HEIGHT; j++) {
        this.board[i][j] = 0;
      }
    }
  };
}
