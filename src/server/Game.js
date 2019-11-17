class Game {
  id = 0;

  players = [];

  result = null;

  start = () => console.log(`Game ${this.id} has started`);

  finish = result => {
    this.result = result;
    console.log(`Game ${this.id} has finished`);
  };
}
