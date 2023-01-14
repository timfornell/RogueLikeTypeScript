import { FLOOR_TILE, WALL_TILE, Tile } from "./tile-types";
import { GameMap } from "./game-map";
import { Display } from "rot-js";
import { Entity, spawnOrc, spawnTroll } from "./entity-classes";

interface Bounds {
   x1: number;
   y1: number;
   x2: number;
   y2: number;
}

class RectangularRoom {
   tiles: Tile[][];

   // The 'public' is used to directly initialize the input variables as class variables
   constructor(public x: number, public y: number, public width: number, public height: number) {
      this.tiles = new Array(this.height);
      this.buildRoom();
   }

   buildRoom() {
      for (let y = 0; y < this.height; y++) {
         const row = new Array(this.width);

         for (let x = 0; x < this.width; x++) {
            const isWall = (x === 0) || (x === this.width - 1) || (y === 0) || (y === this.height - 1);
            row[x] = isWall ? { ...WALL_TILE } : { ...FLOOR_TILE };
         }

         this.tiles[y] = row;
      }
   }

   public get center(): [number, number] {
      const centerX = this.x + Math.floor(this.width / 2);
      const centerY = this.y + Math.floor(this.height / 2);
      return [centerX, centerY];
   }

   public get bounds(): Bounds {
      return {
         x1: this.x,
         y1: this.y,
         x2: this.x + this.width,
         y2: this.y + this.height,
      };
   }

   intersects(other: RectangularRoom): boolean {
      return (
         this.x <= other.x + other.width &&
         this.y <= other.y + other.height &&
         this.x + this.width >= other.x &&
         this.y + this.width >= other.y
      );
   }
}

export function generateDungeon(
   mapWidth: number,
   mapHeight: number,
   maxRooms: number,
   minSize: number,
   maxSize: number,
   maxMonsters: number,
   player: Entity,
   display: Display
): GameMap {
   const maxTries: number = 10;
   const dungeon = new GameMap(mapWidth, mapHeight, display, [player]);

   // https://www.tutorialspoint.com/typescript/typescript_variables.htm
   // Syntax to declare type of 'rooms' and its value on the same row
   const rooms: RectangularRoom[] = [];

   // Try to create maxRooms, if intersection with existing room retry up to maxTries times
   for (let count = 0; count < maxRooms; count++) {
      var newRoom: RectangularRoom;

      for (let numTries = 0; numTries < maxTries; numTries++) {
         newRoom = generateRandomRoom(minSize, maxSize, mapWidth, mapHeight);

         if (rooms.some(r => r.intersects(newRoom))) {
            continue;
         } else {
            dungeon.addRoom(newRoom.x, newRoom.y, newRoom.tiles);

            // Spawn monsters in the rooms
            placeEntities(newRoom, dungeon, maxMonsters);

            rooms.push(newRoom);
            break;
         }
      }
   }

   // Spawn player in a random room
   const startingRoomIndex = generateRandomNumber(0, rooms.length - 1);
   const startPoint = rooms[startingRoomIndex].center;
   player.x = startPoint[0];
   player.y = startPoint[1];


   // Connect rooms
   for (let index = 0; index < rooms.length - 1; index++) {
      const first = rooms[index];
      const second = rooms[index + 1];

      for (let tile of connectRooms(first, second)) {
         dungeon.tiles[tile[1]][tile[0]] = { ...FLOOR_TILE};
      }
   }

   return dungeon;
}

function* connectRooms(a: RectangularRoom, b: RectangularRoom): Generator<[number, number], void, void> {
   // set the start point of our tunnel at the center of the first room
   let current = a.center;
   // set the end point at the center of the second room
   const end = b.center;

   // flip a coin to see if we go horizontally first or vertically
   let horizontal = Math.random() < 0.5;
   // set our axisIndex to 0 (x axis) if horizontal or 1 (y axis) if vertical
   let axisIndex = horizontal ? 0 : 1;

   // we'll loop until our current is the same as the end point
   while (current[0] !== end[0] || current[1] !== end[1]) {
      //are we tunneling in the positive or negative direction?

      // if direction is 0 we have hit the destination in one direction
      const direction = Math.sign(end[axisIndex] - current[axisIndex]);
      if (direction !== 0) {
         current[axisIndex] += direction;
      } else {
         // we've finished in this direction so switch to the other
         axisIndex = axisIndex === 0 ? 1 : 0;
      }

      yield current;
   }
}

function generateRandomNumber(min: number, max: number): number {
   // Add +1 to include max value in possible values
   return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateRandomRoom(
   minSize: number,
   maxSize: number,
   mapWidth: number,
   mapHeight: number
): RectangularRoom {
   const width = generateRandomNumber(minSize, maxSize);
   const height = generateRandomNumber(minSize, maxSize);
   const x = generateRandomNumber(0, mapWidth - width - 1);
   const y = generateRandomNumber(0, mapHeight - height - 1);

   return new RectangularRoom(x, y, width, height);
}

function placeEntities(
   room: RectangularRoom,
   dungeon: GameMap,
   maxMonsters: number,
) {
   const numberOfMonstersToAdd = generateRandomNumber(0, maxMonsters);

   for (let i = 0; i < numberOfMonstersToAdd; i++) {
      const bounds = room.bounds;
      const x = generateRandomNumber(bounds.x1 + 1, bounds.x2 - 1);
      const y = generateRandomNumber(bounds.y1 + 1, bounds.y2 - 1);

      // Check if there are any monsters at selected position
      if (!dungeon.entities.some((e) => e.x == x && e.y == y)) {
         // Determine if monster should be and Ogre or a Troll
         if (Math.random() < 0.8) {
            dungeon.entities.push(spawnOrc(x, y));
         } else {
            dungeon.entities.push(spawnTroll(x, y));
         }
      }
   }
}