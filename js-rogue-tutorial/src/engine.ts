import * as ROT from 'rot-js';
import { handleInput } from './input-handler';
import { Entity, Player } from './entity-classes';
import { GameMap } from './game-map';
import { generateDungeon } from './procgen';

export class Engine {
   public static readonly MAP_WIDTH = 80;
   public static readonly MAP_HEIGHT = 50;

   gameMap: GameMap;
   display: ROT.Display;

   player: Player;
   entities: Entity[]

   constructor(entities: Entity[], player: Player) {
      this.display = new ROT.Display({
         width: Engine.MAP_WIDTH,
         height: Engine.MAP_HEIGHT,
         forceSquareRatio: true
      });

      this.entities = entities;
      this.player = player;

      this.gameMap = generateDungeon(
         Engine.MAP_WIDTH,
         Engine.MAP_HEIGHT,
         10,
         10,
         20,
         this.player,
         this.display);

      // '!' tells the compiler that the object returned by 'getContainer' is never null
      const container = this.display.getContainer()!;
      document.body.appendChild(container);

      window.addEventListener('keydown', (event) => {
         this.update(event);
      });

      this.gameMap.updateFov(this.player);
      this.render();
   }

   render() {
      this.gameMap.render();

      for (var entity of this.entities) {
         this.display.draw(entity.x, entity.y, entity.char, entity.fg, entity.bg);
      }
   }

   update(event: KeyboardEvent) {
      // Clear screen
      this.display.clear();

      // Check if key event is a valid action
      const action = handleInput(event);

      if (action) {
         action.perform(this, this.player);
      }

      // Update canvas
      this.gameMap.updateFov(this.player);
      this.render();
   }
}
