import * as ROT from 'rot-js';

import {
   Action,
   MeleeAction,
   MovementAction,
   WaitAction,
} from '../input-handler';

import { Entity } from '../entity-classes';

export abstract class BaseAI implements Action {
   path: [number, number][];

   constructor() {
      this.path = []
   }

   perform(_entity: Entity) {}

   /**
    * Copmute and return a path to the target position.
    *
    * If there is no valid path then return an empty list.
    *
    * @param destX
    * @param destY
    * @param entity
    */
   calculatePathTo(destX: number, destY: number, entity: Entity) {
      // Lambda function to let Djikstra algorithm know if a tile can be walked on
      const isPassable = (x: number, y: number) => window.engine.gameMap.tiles[y][x].walkable;
      const dijkstra = new ROT.Path.Dijkstra(destX, destY, isPassable, {});

      this.path = [];

      // Provide callback function that saves each calculated path in 'this.path'
      dijkstra.compute(entity.x, entity.y, (x: number, y: number) => {
         this.path.push([x, y]);
      });

      // Since the starting point is included in the path, remove it from the array
      this.path.shift();
   }
}

export class HostileEnemy extends BaseAI {
   constructor() {
      super();
   }

   perform(entity: Entity): void {
      const target = window.engine.player;
      const dx = target.x - entity.x;
      const dy = target.y - entity.y;
      const distance = Math.max(Math.abs(dx), Math.abs(dy));

      if (window.engine.gameMap.tiles[entity.y][entity.x].visible) {
         if (distance <= 1) {
            return new MeleeAction(dx, dy).perform(entity);
         }

         this.calculatePathTo(target.x, target.y, entity);
      }

      if (this.path.length > 0) {
         const [destX, destY] = this.path[0];
         this.path.shift();

         return new MovementAction(destX - entity.x, destY - entity.y).perform(entity);
      }

      return new WaitAction().perform(entity);
   }
}