import * as ROT from 'rot-js';
import { handleInput, MovementAction } from './input-handler';
import { Entity, Player } from './entity-classes';

class Engine {
  public static readonly WIDTH = 80;
  public static readonly HEIGHT = 50;

  display: ROT.Display;
  player: Player;
  npc: Entity;
  entities: Entity[]

  constructor() {
    this.display = new ROT.Display({
      width: Engine.WIDTH,
      height: Engine.HEIGHT
    });

    this.player = new Player(Engine.WIDTH / 2, Engine.HEIGHT / 2);
    this.npc = new Entity(Engine.WIDTH / 2 - 5, Engine.HEIGHT / 2, '#', '#fff', '#000');
    this.entities = [this.player, this.npc];

    // '!' tells the compiler that the object returned by 'getContainer' is never null
    const container = this.display.getContainer()!;
    document.body.appendChild(container);

    window.addEventListener('keydown', (event) => {
      this.update(event);
    });

    this.render();
  }

  render() {
    for (var entity of this.entities) {
      this.display.draw(entity.x, entity.y, entity.char, entity.fg, entity.bg);
    }
  }

  update(event: KeyboardEvent) {
    // Clear screen
    this.display.clear();

    // Check if key event is a valid action
    const action = handleInput(event);

    if (action instanceof MovementAction) {
      this.player.move(action.dx, action.dy);
    }

    // Update canvas
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

