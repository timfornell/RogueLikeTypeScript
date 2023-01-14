import * as ROT from 'rot-js';
import { Display } from 'rot-js';
import { FLOOR_TILE, Tile } from './tile-types';
import { Entity } from './entity-classes';
import { WALL_TILE } from './tile-types';

export class GameMap {
   tiles: Tile[][];

   constructor(
      public width: number,
      public height: number,
      public display: Display,
      public entities: Entity[],
   ) {
      this.tiles = new Array(this.height);
      for (let y = 0; y < this.height; y++) {
         const row = new Array(this.width);

         for (let x = 0; x < this.width; x++) {
             // Important: '...' is used to create copies of 'WALL_TILE' and not references
            row[x] = { ...WALL_TILE };
         }

         this.tiles[y] = row;
      }
   }

   render() {
      for (let y = 0; y < this.tiles.length; y++) {
         const row = this.tiles[y];

         for (let x = 0; x < row.length; x++) {
            const tile = row[x];
            let char = ' ';
            let fg = '#fff';
            let bg = '#000';

            if (tile.visible) {
               char = tile.light.char;
               fg = tile.light.fg;
               bg = tile.light.bg;
            } else if (tile.seen) {
               char = tile.dark.char;
               fg = tile.dark.fg;
               bg = tile.dark.bg;
            }

            this.display.draw(x, y, char, fg, bg);
         }

         this.entities.forEach((e) => {
            if (this.tiles[e.y][e.x].visible) {
               this.display.draw(e.x, e.y, e.char, e.fg, e.bg);
            }
         });
      }
   }

   isInBounds(x: number, y: number) {
      return 0 <= x && x < this.width && 0 <= y && y < this.height;
   }

   addRoom(x: number, y: number, roomTiles: Tile[][]) {
      for (let curY = y; curY < y + roomTiles.length; curY++) {
         const mapRow = this.tiles[curY];
         const roomRow = roomTiles[curY - y];

         for (let curX = x; curX < x + roomRow.length; curX++) {
            mapRow[curX] = roomRow[curX - x];
         }
      }
   }

   lightPasses(x: number, y: number): boolean {
      if (this.isInBounds(x, y)) {
         return this.tiles[y][x].transparent;
      }

      return false;
   }

   updateFov(player: Entity) {
      // Reset visibility for all available tiles
      for (let y = 0; y < this.height; y++) {
         for (let x = 0; x < this.width; x++) {
            this.tiles[y][x].visible = false;
         }
      }

      const fovRadius: number = 8;
      const fov = new ROT.FOV.PreciseShadowcasting(this.lightPasses.bind(this));
      fov.compute(player.x, player.y, fovRadius, (x, y, _r, visibility) => {
         // This is passed as a callback function to the 'compute' function
         if (visibility === 1) {
            this.tiles[y][x].visible = true;
            this.tiles[y][x].seen = true;
         }
      });
   }

   // The '|' is used to say that a function/method can return different types. In this case, the find function will
   // either return an Entity object or undefined, if no Entity fulfilling the criteria was found.
   getBlockingEntityAtLocation(x: number, y: number): Entity | undefined {
      return this.entities.find(
         (e) => e.blocksMovement && e.x === x && e.y === y,
      );
   }
}