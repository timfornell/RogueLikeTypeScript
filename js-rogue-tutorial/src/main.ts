import * as ROT from 'rot-js';

class Player {
  playerX: number;
  playerY: number;

  constructor(displayWidht: number, displayHeight: number) {
    this.playerX = displayWidht / 2;
    this.playerY = displayHeight / 2;
  }
}

class Engine {
  public static readonly WIDTH = 80;
  public static readonly HEIGHT = 50;

  display: ROT.Display;
  player: Player;

  constructor() {
    this.display = new ROT.Display({
      width: Engine.WIDTH,
      height: Engine.HEIGHT
    });

    this.player = new Player(Engine.WIDTH, Engine.HEIGHT);

    // '!' tells the compiler that the object returned by 'getContainer' is never null
    const container = this.display.getContainer()!;
    document.body.appendChild(container);

    this.render();
  }

  render() {
    const x = this.player.playerX;
    const y = this.player.playerY;
    this.display.draw(x, y, "@", '#fff', '#000');
  }
}

declare global {
  // Extend the 'Window' class with a variable called 'engine'
  interface Window {
    engine: Engine;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.engine = new Engine();
});
