// Make it possible to import 'Entity' in other files

export class Entity {
   constructor(
      public x: number,
      public y: number,
      public char: string,
      public fg: string = '#fff',
      public bg: string = '#000'
      ) {}

   move(dx: number, dy: number) {
      this.x += dx;
      this.y += dy;
    }
}

export class Player extends Entity {
   constructor(x: number, y: number) {
     super(x, y, '@', '#fff', '#c8b432');
   }
}