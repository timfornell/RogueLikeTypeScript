import * as ROT from 'rot-js';
import { handleInput, MovementAction } from './input-handler';

class Player {
  playerX: number;
  playerY: number;
  width: number;
  height: number;

  constructor(displayWidht: number, displayHeight: number) {
    this.width = displayWidht;
    this.height = displayHeight;
    this.playerX = displayWidht / 2;
    this.playerY = displayHeight / 2;
  }

  move(dx: number, dy: number) {
    this.playerX += dx;
    this.playerY += dy;

    this.clampPositionToDisplay();
  }

  clampPositionToDisplay() {
    if (this.playerX < 0) {
      this.playerX = 0;
    }

    if (this.playerX >= this.width) {
      this.playerX = this.width - 1;
    }

    if (this.playerY < 0) {
      this.playerY = 0;
    }

    if (this.playerY >= this.height) {
      this.playerY = this.height - 1;
    }
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

    window.addEventListener('keydown', (event) => {
      this.update(event);
    });

    this.render();
  }

  render() {
    const x = this.player.playerX;
    const y = this.player.playerY;
    this.display.draw(x, y, "@", '#fff', '#000');
  }

  update(event: KeyboardEvent) {
    // Clear screen
    this.display.clear();

    // Check if key event is a valid action
    const action = handleInput(event);

    if (action instanceof MovementAction) {
      this.player.move(action.dx, action.dy);
    }

    // Draw player at new position
    this.render();
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

