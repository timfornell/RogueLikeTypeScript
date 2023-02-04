import { BaseAI, HostileEnemy } from "./components/ai";
import { Fighter } from "./components/figher";

// Make it possible to import 'Entity' in other files
export class Entity {
   constructor(
      public x: number,
      public y: number,
      public char: string,
      public fg: string = '#fff',
      public bg: string = '#000',
      public name: string = '<Unnamed>',
      public blocksMovement: boolean = false,
      ) {}

   move(dx: number, dy: number) {
      this.x += dx;
      this.y += dy;
    }
}

export class Actor extends Entity {
   constructor(
      public x: number,
      public y: number,
      public char: string,
      public fg: string = '#fff',
      public bg: string = '#000',
      public name: string = '<Unnamed>',
      // Allow null since the player will be an actor but without AI
      public ai: BaseAI | null,
      public figher: Fighter,
   ) {
      super(x, y, char, fg, bg, name, true);
      this.figher.entity = this;
   }

   public get isAlive(): boolean {
      // Check to determine if object is player or not
      return !!this.ai ||  window.engine.player == this;
   }
}

export function spawnPlayer(x: number, y: number): Entity {
   return new Actor(x, y, '@', '#fff', '#000', 'Player', null, new Fighter(30, 2, 5));
}

export function spawnOrc(x: number, y: number): Entity {
   return new Actor(x, y, 'o', '#3f7f3f', '#000', 'Orc', new HostileEnemy(), new Fighter(10, 0, 3));
}

export function spawnTroll(x: number, y: number): Entity {
   return new Actor(x, y, 'T', '#007f00', '#000', 'Troll', new HostileEnemy(), new Fighter(16, 1, 4));
}