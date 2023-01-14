import { Engine } from "./engine";
import { Entity } from "./entity-classes";

// Make the interface 'Action' available to import in other files
export interface Action {
   perform: (engine: Engine, entity: Entity) => void;
}

export abstract class ActionWithDirection implements Action {
   constructor(public dx: number, public dy: number) {}

   perform(_engine: Engine, _entity: Entity) {}
}

// 'implements' mean that the class should implement/contain any veriables or functions defined in the interface
export class MovementAction extends ActionWithDirection {
   perform(engine: Engine, entity: Entity) {
      const destX = entity.x + this.dx;
      const destY = entity.y + this.dy;

      if (!engine.gameMap.isInBounds(destX, destY)) return;
      if (!engine.gameMap.tiles[destY][destX].walkable) return;
      if (engine.gameMap.getBlockingEntityAtLocation(destX, destY)) return;

      entity.move(this.dx, this.dy);
   }
}

export class MeleeAction extends ActionWithDirection {
   perform(engine: Engine, entity: Entity) {
      const destX = entity.x + this.dx;
      const destY = entity.y + this.dy;

      const target = engine.gameMap.getBlockingEntityAtLocation(destX, destY);

      if (!target) return;

      console.log(`You kick the ${target.name}, much to its annoyance!`);
   }
}

export class BumpAction extends ActionWithDirection {
   perform(engine: Engine, entity: Entity) {
      const destX = entity.x + this.dx;
      const destY = entity.y + this.dy;

      if (engine.gameMap.getBlockingEntityAtLocation(destX, destY)) {
         return new MeleeAction(this.dx, this.dy).perform(engine, entity);
      } else {
         return new MovementAction(this.dx, this.dy).perform(engine, entity);
      }
   }
}

interface MovementMap {
   // This means that MovementMap will contain an array of undetermined size where the keys are strings and the values
   //  are of type Action.
   [key: string]: Action;
}

const MOVE_KEYS: MovementMap = {
   ArrowUp: new BumpAction(0, -1),
   ArrowDown: new BumpAction(0, 1),
   ArrowLeft: new BumpAction(-1, 0),
   ArrowRight: new BumpAction(1, 0),
};

export function handleInput(event: KeyboardEvent): Action {
   return MOVE_KEYS[event.key];
}