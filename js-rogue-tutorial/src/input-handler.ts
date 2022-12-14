import { Engine } from "./engine";
import { Entity } from "./entity-classes";

// Make the interface 'Action' available to import in other files
export interface Action {
   perform: (engine: Engine, entity: Entity) => void;
}

// 'implements' mean that the class should implement/contain any veriables or functions defined in the interface
export class MovementAction implements Action {
   dx: number;
   dy: number;

   constructor(dx: number, dy:number) {
      this.dx = dx;
      this.dy = dy;
   }

   perform(engine: Engine, entity: Entity) {
      const destX = entity.x + this.dx;
      const destY = entity.y + this.dy;

      if (!engine.gameMap.isInBounds(destX, destY)) return;
      if (!engine.gameMap.tiles[destY][destX].walkable) return;

      entity.move(this.dx, this.dy);
   }
}

interface MovementMap {
   // This mean that MovementMap will contain an array of undetermined size where the keys are strings and the values
   //  are of type Action.
   [key: string]: Action;
}

const MOVE_KEYS: MovementMap = {
   ArrowUp: new MovementAction(0, -1),
   ArrowDown: new MovementAction(0, 1),
   ArrowLeft: new MovementAction(-1, 0),
   ArrowRight: new MovementAction(1, 0),
};

export function handleInput(event: KeyboardEvent): Action {
   return MOVE_KEYS[event.key];
}