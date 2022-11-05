import * as ROT from 'rot-js';
import { handleInput, MovementAction } from './input-handler';
import { Entity, Player } from './entity-classes';

export class Engine {
  public static readonly WIDTH = 80;
  public static readonly HEIGHT = 50;

  display: ROT.Display;

  player: Player;
  entities: Entity[]

  constructor(entities: Entity[], player: Player) {
    this.entities = entities;
    this.player = player;

    this.display = new ROT.Display({
      width: Engine.WIDTH,
      height: Engine.HEIGHT,
      forceSquareRatio: true
    });

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
