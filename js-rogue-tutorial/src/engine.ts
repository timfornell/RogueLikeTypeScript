import * as ROT from 'rot-js';
import { handleInput } from './input-handler';
import { Entity } from './entity-classes';
import { GameMap } from './game-map';
import { generateDungeon } from './procgen';

export class Engine {
   public static readonly MAP_WIDTH = 80;
   public static readonly MAP_HEIGHT = 50;
   public static readonly MAX_ROOMS = 10;
   public static readonly MIN_ROOM_SIZE = 10;
   public static readonly MAX_ROOM_SIZE = 20;
   public static readonly MAX_MONSTERS_PER_ROOM = 2;

   gameMap: GameMap;
   display: ROT.Display;

   player: Entity;

   constructor(player: Entity) {
      this.display = new ROT.Display({
         width: Engine.MAP_WIDTH,
         height: Engine.MAP_HEIGHT,
         forceSquareRatio: true
      });

      this.player = player;

      this.gameMap = generateDungeon(
         Engine.MAP_WIDTH,
         Engine.MAP_HEIGHT,
         Engine.MAX_ROOMS,
         Engine.MIN_ROOM_SIZE,
         Engine.MAX_ROOM_SIZE,
         Engine.MAX_MONSTERS_PER_ROOM,
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
   }

   update(event: KeyboardEvent) {
      // Clear screen
      this.display.clear();

      // Check if key event is a valid action
      const action = handleInput(event);

      if (action) {
         action.perform(this, this.player);
      }

      this.handleEnemyturns();

      // Update canvas
      this.gameMap.updateFov(this.player);
      this.render();
   }

   handleEnemyturns() {
      this.gameMap.nonPlayerEntities.forEach((e) => {
         console.log(
            `The ${e.name} wonders when it will get to take a real turn.`,
         );
      });
   }
}
