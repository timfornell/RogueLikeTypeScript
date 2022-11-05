// Make it possible to import 'Entity' in other files

export class Entity {
   x: number;
   y: number;
   char: string;
   fg: string; // Foreground color
   bg: string; // Background color

   constructor(x: number, y: number, char: string, fg: string = '#fff', bg: string = '#000') {
      this.x = x;
      this.y = y;
      this.char = char;
      this.fg = fg;
      this.bg = bg;
   }

   move(dx: number, dy: number) {
      this.x += dx;
      this.y += dy;
    }
}

export class Player extends Entity {
   constructor(x: number, y: number) {
     super(x, y, '@', '#fff', '#000');
   }
}