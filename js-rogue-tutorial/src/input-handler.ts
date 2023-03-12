import { Engine } from "./engine";
import { Entity } from "./entity-classes";

// Make the interface 'Action' available to import in other files
export interface Action {
   perform: (entity: Entity) => void;
}

export abstract class ActionWithDirection implements Action {
   constructor(public dx: number, public dy: number) {}

   perform(_entity: Entity) {}
}

// 'implements' mean that the class should implement/contain any veriables or functions defined in the interface
export class MovementAction extends ActionWithDirection {
   perform(entity: Entity) {
      const destX = entity.x + this.dx;
      const destY = entity.y + this.dy;

      if (!window.engine.gameMap.isInBounds(destX, destY)) return;
      if (!window.engine.gameMap.tiles[destY][destX].walkable) return;
      if (window.engine.gameMap.getBlockingEntityAtLocation(destX, destY)) return;

      entity.move(this.dx, this.dy);
   }
}

export class MeleeAction extends ActionWithDirection {
   perform(entity: Entity) {
      const destX = entity.x + this.dx;
      const destY = entity.y + this.dy;

      const target = window.engine.gameMap.getBlockingEntityAtLocation(destX, destY);

      if (!target) return;

      console.log(`You kick the ${target.name}, much to its annoyance!`);
   }
}

export class BumpAction extends ActionWithDirection {
   perform(entity: Entity) {
      const destX = entity.x + this.dx;
      const destY = entity.y + this.dy;

      if (window.engine.gameMap.getBlockingEntityAtLocation(destX, destY)) {
         return new MeleeAction(this.dx, this.dy).perform(entity);
      } else {
         return new MovementAction(this.dx, this.dy).perform(entity);
      }
   }
}

export class WaitAction implements Action {
   perform(_entity: Entity) {}
}

interface MovementMap {
   // This means that MovementMap will contain an array of undetermined size where the keys are strings and the values
   //  are of type Action.
   [key: string]: Action;
}

const MOVE_KEYS: MovementMap = {
   // Arrow Keys
   ArrowUp: new BumpAction(0, -1),
   ArrowDown: new BumpAction(0, 1),
   ArrowLeft: new BumpAction(-1, 0),
   ArrowRight: new BumpAction(1, 0),
   Home: new BumpAction(-1, -1),
   End: new BumpAction(-1, 1),
   PageUp: new BumpAction(1, -1),
   PageDown: new BumpAction(1, 1),
   // Numpad Keys
   1: new BumpAction(-1, 1),
   2: new BumpAction(0, 1),
   3: new BumpAction(1, 1),
   4: new BumpAction(-1, 0),
   6: new BumpAction(1, 0),
   7: new BumpAction(-1, -1),
   8: new BumpAction(0, -1),
   9: new BumpAction(1, -1),
   // Gamer keys
   a: new BumpAction(-1, 0),
   s: new BumpAction(0, 1),
   w: new BumpAction(0, -1),
   d: new BumpAction(1, 0),
   y: new BumpAction(-1, -1),
   u: new BumpAction(1, -1),
   b: new BumpAction(-1, 1),
   n: new BumpAction(1, 1),
   // Wait keys
   5: new WaitAction(),
   Period: new WaitAction(),
};

export function handleInput(event: KeyboardEvent): Action {
   return MOVE_KEYS[event.key];
}