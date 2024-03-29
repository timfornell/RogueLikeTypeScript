# Information
While browsing the web for new projects to do I found a subreddit called
[/r/roguelikedev](https://www.reddit.com/r/roguelikedev) which hosts an annual event where the participants build their
own roguelike games. The tutorial can be found [here](https://rogueliketutorials.com/) and is written for Python 3.
One can also find participants from previous events and their contributions on their
[wiki-page](https://www.reddit.com/r/roguelikedev/wiki/python_tutorial_series/#wiki_directory_of_participants).

Since I have already done a lot of coding in Python, both at work and on my free time, I wanted to try something new.
Therefore, this project will be written in TypeScript. A programming language I know basically nothing about, apart
from that it can be considered an enhanced version of JavaScript. As can be seen in the previous link, there are already
people who have done this in TypeScript. Which means that this is not an impossible undertaking.

This README file will be written continously as I following along with the tutorial and will be split up into different
chapters which correspond to the different parts from the tutorial.

## Part 0 - Getting started
While browsing the subreddit a bit more I actually found a
[tutorial for TypeScript](https://klepinger.dev/rotjs-tutorial) written by someone by the name of Nik Klepinger. The
idea is to follow this tutorial instead of the one linked above.

### Setting up the environment
Since I have never used TypeScript previously the first step is to find the documentation for how to get started with
that. On the [official page](https://www.typescriptlang.org/download) there are two ways to install/download it; via npm
or via Visual Studio. The tutorial by Nick says that we should be using 'npm'. This appears to be some sort of package
manager for JavaScript which can be accessed by installing Node.js from their [webpage](https://nodejs.org/en/).

Once that is installed, alongside with all dependencies, simply run <code>npm install typescript --save-dev</code>
from a command prompt to install TypeScript. There are two other packages that needs to be installed:
- ViteJs
- ROT

There is a short explanation about what they are in Nicks tutorial. But in short, [**ViteJs**](https://vitejs.dev/) is a "ridiculously fast" (according to Nick) dev server and [**ROT**](https://ondras.github.io/rot.js/hp/) is a roguelike toolkit.

ROT is installed by running <code>npm install rot-js</code> and the development server is set up by running:
```Shell
npm create vite@latest js-rogue-tutorial
# Choosing 'Vanilla' and 'TypeScript' in the prompts that show up
cd js-rogue-tutorial
npm install
```

### First lines of code
After the installation is complete the development server is started up running
```Shell
npm run dev
```
inside the folder <code>js-rogue-tutorial</code>. If the following text is visible in the terminal
```Shell
  VITE v3.1.8  ready in 202 ms

  ➜  Local:   http://127.0.0.1:5173/
  ➜  Network: use --host to expose
```
the server is successfully started and can be accessed in a browser by visiting the adress provided.

Now, the first lines of code can be found in the file
[main.ts]([js-rogue-tutorial\src\main.ts](https://github.com/timfornell/RogueLikeTypeScript/blob/Tutorial_Part0/js-rogue-tutorial/src/main.ts))
on the branch <code>Tutorial_Part0</code>.

## Part 1 - Refactoring and drawing player character
### Refactoring
Next steps in the guide are some simple refactorings of the code. The refactoring is done in order to 'hide' the engine
details from the event listener (DCMContentLoaded). To achieve this, the interface <code>Window</code> needs to be extended
to include an instance of the <code>Engine</code> class. This is done by utilizing the keyword <code>declare global</code>:
```TypeScript
declare global {
  interace Window {
    // <Variable name>: <Type>
    engine: Engine;
  }
}
```
After this, the constructor of the <code>Engine</code> class is modified to include the setup that was previously done
in 'DOMContentLoadeed'. That concludes the refactoring. Now the server should display the message 'Hello World!' again.

### Adding the player character
A new class is created <code>Player</code> that will be in charge of handling everything related to the player (except
for drawing it on the displa). At the moment, it it very minimalistic and only contains the *x* and *y* position.
```TypeScript
class Player {
  playerX: number;
  playerY: number;

  constructor(displayWidht: number, displayHeight: number) {
    this.playerX = displayWidht / 2;
    this.playerY = displayHeight / 2;
  }
}
```
An instance of this class is added to the <code>Engine</code> class for easy access.

### Adding input handling
To allow the character to move around on the screen inputs from the keyboard needs to be handled. To prepare for this,
a new file *input-handler.ts* is created. This file will define a class called <code>MovementAction</code> and a function
called <code>handleInput</code>. The function is intended to be called every time a key press should be handled, it
indexes an array <code><MOVE_KEYS</code> with the provided key to see if it is a valid key press.
```TypeScript
const MOVE_KEYS: MovementMap = {
   ArrowUp: new MovementAction(0, -1),
   ArrowDown: new MovementAction(0, 1),
   ArrowLeft: new MovementAction(-1, 0),
   ArrowRight: new MovementAction(1, 0),
};

handleInput(event: KeyboardEvent): Action {
   return MOVE_KEYS[event.key];
}
```
The array <code>MOVE_KEYS</code> contains elements of the <code>MovementAction</code> class. Which at the moment only
handles movement actions (hence the name). It contains two variables <code>dx, dy</code> that indicates in what direction
the player should move for the given key press.
```TypeScript
export class MovementAction implements Action {
   dx: number;
   dy: number;

   constructor(dx: number, dy:number) {
      this.dx = dx;
      this.dy = dy;
   }
}
```
One important note here is that it *implements* the <code>Action</code> interface. This basically meant that any functions
or variables declared by that interface has to be implemented in the class. At the moment the interface is empty, so it
doesn't actually impact anything though.

### Moving the player character
With all help functions and interfaces defined the next step is to make the player actually move. This is done by firstly
importing the function <code>handleInput</code> and the class <code>MovementAction</code> with
```TypeScript
import { handleInput, MovementAction } from './input-handler';
```
Secondly, the <code>Player</code> class is updated with a function, <code>move</code>, that that updates the x and y position.
Lastly, the <code>Engine</code> class is updated to listen after key events:
```TypeScript
// Added in the constructor
window.addEventListener('keydown', (event) => {
  this.update(event);
});
```
and with a function to update the player position and to update the display:
```TypeScript
update(event: KeyboardEvent) {
  // Clear screen
  this.display.clear();

  // Check if key event is a valid action
  const action = handleInput(event);

  if (action instanceof MovementAction) {
    this.player.move(action.dx, action.dy);
  }

  // Draw player at new position
  this.render();
}
```

## Part 2 - Generic entities and map setup
Next part is about further expanding the environment since having only a player character to move around is likely to
become boring after a while.

### Creating entities
First step is to create a class that can be used to represent whatever entities we want to throw in to the game.
The tutorial explains how to create a new class called <code>Entity</code>. However, since I already have a class called
<code>Player</code> I will instead take this opportunity to try out some class inheritance. The player class and any other
entity that will be able to move around on the canvas will undoubtedly have some common elements. My idea is
to put these common elements in the class <code>Entity</code> and then let the <code>Player</code> class inherit
from that class. The idea to separate the player class is that it might have some elements that other entities shouldn't
have. At the same time a new file is created to put this in: *input-handler*. Which ends up looking like this:

```TypeScript
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
```
After this, the <code>Engine</code> class is updated to include the following:
```TypeScript
this.player = new Player(Engine.WIDTH / 2, Engine.HEIGHT / 2);
this.npc = new Entity(Engine.WIDTH / 2 - 5, Engine.HEIGHT / 2, '#', '#fff', '#000');
this.entities = [this.player, this.npc];
```
This makes it easy to loop over any entities when drawing.

### Refactoring main.ts
The *main.ts* file currently contains the <code>Engine</code> class, which probably makes more sense to have in a
separate file. Therefore, it is moved to the file *engine.ts*. At the same time the constructor is modified according to:
```TypeScript
constructor(entities: Entity[], player: Player) {
  this.entities = entities;
  this.player = player;

  // Unmodified code below is exluded
}
```
Now, this is a bit confusing becase the input <code>entities</code> contains a reference to the same object that the
<code>player</code> variable is referring to. This is, again, useful for when drawing all entities on the canvas and to
make it easier to access the player character in the future.

### Creating an environment
Now that it is possible to have entities (npcs) and a player on the canvas, the next step is to create some sort of map
that adds some more variety to the game. In order to do this, the file *tile-types.ts* is created. It contains the two
following definitions:
```TypeScript
export interface Graphic {
   char: string; // Display character
   fg: string; // Foreground color
   bg: string; // Background color
}

export interface Tile {
   walkable: boolean;
   transparent: boolean; // If see-through
   dark: Graphic; // What to draw if not in field of view
}
```
The interface <code>Tile</code> is what will be used to create the different objects for the map. At the moment, there
are only two different tiles to start with, the <code>FLOOR_TILE</code> and the <code>WALL_TILE</code>. The first one
is both walkable and transparent, while the second is neither.

Next step is to add the actual map. To do this, a new file *game-maps.ts* is created. It contains a class
<code>GameMap</code> which contains the following parameters and functions:
```TypeScript
export class GameMap {
   width: number;
   height: number;
   display: Display;

   tiles: Tile[][]; // First 'array' contains y coordinates and second 'array' contains x coordinates

   constructor(width: number, height: number, display: Display) {
      // Initialize the game map
      // Iterate through this.tiles and either create a floor or wall tile for each coordinate
   }

   isInBounds(x: number, y: number) {
      // Check if x and y coordinates are inside display borders
   }

   render() {
      // Iterate through all objects in this.tiles and call this.display.draw
   }
}
```
As can be seen in the constructor, the game map is created there. At the moment it is very simple and only contains some
walls at predefined positions and floor in every other place.

## Part 3 - Dungeon Generation
Now that the <code>GameMap</code> class is available, the natural next step is to expand upon it to create an actual
game map. As Nick explains however, it is worth trying to separate the generation of the map from the code that
interacts with an already created map. Therefore, a new file, *procgen.ts*, will be created.
### Creating rooms
We are starting simple, meaning we make it possible to create rectangular rooms. To do this a class
<code>RectangularRoom</code> is created. As can be seen in the code below, it is a fairly straight forward class.
Upon creating an instance of the class it requires the top left x and y position along with the width and height of the
room.

```
class RectangularRoom {
   tiles: Tile[][];

   // The 'public' is used to directly initialize the input variables as class variables
   constructor(public x: number, public y: number, public width: number, public height: number) {
      this.tiles = new Array(this.height);
      this.buildRoom();
   }

   buildRoom() {
      // Iterate through 'tiles' and add wall tiles along the edges
   }

   public get center(): [number, number] {
      // Get the center coordinate of the room
   }
}
```
There are two things that are worth mentioning here. The first is that the constructor utilizes the keyword 'public' for
the input variables.Apparently, this is a way to declare that these variables will become class members without having
to write <code>this.variable = variable</code> inside the constructor. The second is the use of the keyword 'get' for
the function <code>center</code>. This keyword basically means that the function returns a property of the class.
Incidentally, there is another keyword called 'set' which can be used to indicate that a function modifies a property
of the class.

Alongside this class we will also create a function called <code>generateDungeon</code>. This is the function that will
be used by the <code>GameMap</code> class to get a generated map. It will take the display width, display height and
a <code>Display</code> object:

```TypeScript
export function generateDungeon(width: number, height: number, display: Display): GameMap {
   const dungeon = new GameMap(width, height, display);

   const room1 = new RectangularRoom(20, 15, 10, 15);
   const room2 = new RectangularRoom(35, 20, 10, 15);

   dungeon.addRoom(room1.x, room1.y, room1.tiles);
   dungeon.addRoom(room2.x, room2.y, room2.tiles);

   return dungeon;
}
```
Currently, it reteurns a map that consists of wall tiles and two rooms labeled 'room1' and 'room2'. I haven't explained
the function <code>addRoom</code>, but it simple copies the tiles from the <code>tiles</code> variable in the respective
room variable to the 'global' <code>tiles</code> tiles variable in the 'dungeon' variable.

### Creating corridors
Just having two rooms alongside eachother isn't necessarily super exiciting. So, to make it just a tiny bit more
exciting, we are going to add a connection (corridor) in between them. This is done by adding a function called
<code>connectRooms</code>. The idea is to start at the center of one room (hence the <code>center</code>), select a
starting direction (vertical or horizontal), create walkable tiles in said direction until the corridor is aligned
with the center of the target room then switch direction and continue the corridor until the center of the target room
is reached. This means that all rooms will be connected by either a 90 degree turn or a straight line, depending on
their respective orientation. The function will end up looking like this:
```TypeScript
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
```
This new function is however a bit special. It isn't a normal function, it is a 'generator function'. This is indicated
by the 'Generator' keyword that can be seen after the 'usual' function defintion. The reason for declaring this function
as a generator function is to make use of the keyword 'yield'. There is probably more to this than I understand, but
this makes it possible for a function to return values during execution while still allowing further execution.

### Creating random dungeons
Now that functionality to create rooms and connect them with corridors, then natural next step is to create more rooms.
The rooms available up until this step are hard coded so for this part the focus will be to instead generate random
rooms. To make this possible, some functions are added in the *procgen.ts* file, one utility function and one class
function in the <code>RectangularRoom</code> class:

```TypeScript
class RectangularRoom {

   // Existing code excluded

   intersects(other: RectangularRoom): boolean {
      return (
         this.x <= other.x + other.width &&
         this.x + this.width >= other.x &&
         this.y <= other.y + other.height &&
         this.y + this.width >= other.y
      );
   }
}

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
```

The first function, <code>intersects</code>, checks if the current object intersect with the room provided as input.
The second function is pretty self explanatory.

Next step is to rewrite the entire <code>generateDungeon</code> function to make use of these two functions to generate
a 'random' dungeon. Firstly, it is updated with a few more input variables that indicate the max number of rooms and the
max size of the rooms in x and y direction, along with a reference to the player object. The player object is added so
that it can be spawned at a desired location in the generated rooms. The function body is rewritten to iterate over the
variable <code>maxRooms</code>, generate a random room, check if it intersects with any existing rooms and add it to the
dungeon if it doesn't. If it overlaps, it is allowed to retry up to <code>maxTries</code> (= 10) times to find another
room that can be added.

```TypeScript
// Try to create maxRooms, if intersection with existing room retry up to maxTries times
for (let count = 0; count < maxRooms; count++) {
   var newRoom: RectangularRoom;

   for (let numTries = 0; numTries < maxTries; numTries++) {
      newRoom = generateRandomRoom(minSize, maxSize, mapWidth, mapHeight);

      if (rooms.some(r => r.intersects(newRoom))) {
         continue;
      } else {
         dungeon.addRoom(newRoom.x, newRoom.y, newRoom.tiles);
         rooms.push(newRoom);
         break;
      }
   }
}
```

As mentioned, the function now takes a reference to the player entity as an input. The player is spawned in a random
room with the following code (after all rooms have been created):

```TypeScript
// Spawn player in a random room
const startingRoomIndex = generateRandomNumber(0, rooms.length - 1);
const startPoint = rooms[startingRoomIndex].center;
player.x = startPoint[0];
player.y = startPoint[1];
```

Last part is to connect all the rooms to eachother. This is done in a very simple way, by iterating over the created
rooms and connecting them pairwise:

```TypeScript
// Connect rooms
for (let index = 0; index < rooms.length - 1; index++) {
   const first = rooms[index];
   const second = rooms[index + 1];

   for (let tile of connectRooms(first, second)) {
      dungeon.tiles[tile[1]][tile[0]] = { ...FLOOR_TILE};
   }
}
```

If the call to <code>generateDungeon</code> is modified to include the new parameters the dungeon map now includes
randomly generated rooms and the player entity is spawned randomly in one of them.

## Part 4 - Field of View
At the moment the whole map is always visible regardless of where the player is. This doesn't really make sense, so the
next step is to add visibility based on where the player is. To do this the first step is to expand the <code>Tile</code>
interface according to:

```TypeScript
export interface Tile {
   walkable: boolean;
   transparent: boolean; // If see-through
   visible: boolean; // If block can be seen by player
   seen: boolean; // If blocke has previously been seeen by player
   dark: Graphic; // What to draw if not in field of view
   light: Graphic; // What to draw if block is in field of view
};
```

Calculating what blocks are in the players field of view will be in a new function, <code>updateFov</code>, inside the
<code>GameMap</code> class with <code>PreciseShadowcasting</code> from theROT library. According to:

```TypeScript
updateFov(player: Player) {
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
```

Since this function is called every time the screen is rendered, it starts of by "resetting" the visible flag for all
blocks on the map. If not, previously seen blocks will remain visible even after the player isn't near them anymore.
The function <code>lightPasses</code> that is passed to <code>PreciseShadowcasting</code> is used to make sure that when
the visible blocks are calculated, we always look at x and y coordinates inside the game map. Without it, it is possible
that negative coordinates are attemped to be indexed, depending on where the player stands. The actualy computation is
done by calling the <code>compute</code> function. As can be seen, it takes the player position, a fov radius and a
lambda function. The lambda function is used as a callback function and will be called for every tile computed by the
algorithm. This callback function checks the return value <code>visibility</code> from the fov computation and if it
equals 1, sets the tile at coordinates (x, y) to visible.

## Part 5 - Adding enemies
A true dungeoncrawler needs enemies, so to take this game a tiny bit closer to this, some enemies need to be added.

### But first, some housekeeping
The housekeeping consists of shuffling some code around. The idea is to move the list of entities from the *main.ts*
file to the class <code>GameMap</code>. Which, makes more sense if you think about it. The enemies could be considered
to be "part" of the map and will be interacted with by the player in the same way as other map structures.

### Spawning enemies
There are probably many different ways of doing this, but the idea for now is to, whenever a room is created, spawn a
random number of enemies in said room at various locations. To make this as simple as possible, an interface containing
the boundaries of the rooms is created:

```TypeScript
interface Bounds {
   x1: number;
   y1: number;
   x2: number;
   y2: number;
}
```

Together with a getter in the class <code>RectangularRoom</code>.

After this, a function to do the actual spawning is created. It is called <code>placeEntities</code> and is placed in
the *procgen.ts* file. It takes in the max number of monster to spawn alongside with the game map and the room to spawn
in. It then tries to create a ranom number of monsters at random locations inside the room. If the place is already
occupied by another monster, no new position is found.

```TypeScript
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
            console.log("We'll be putting an orc at (${x}, ${y})!");
         } else {
            console.log("We'll be putting a troll at (${x}, ${y})!");
         }
      }
   }
}
```

As can be seen in the function <code>placeEntities</code>, nothing is actually added to the dungeon yet. It only prints
a message to the console that an entity will be spawned at a specific location. This is solved by adding some helper
functions in the *entity-classes.ts* file:

```TypeScript

export function spawnPlayer(x: number, y: number): Entity {
   return new Entity(x, y, '@', '#fff', '#000', 'Player', true);
}

export function spawnOrc(x: number, y: number): Entity {
   return new Entity(x, y, 'o', '#3f7f3f', '#000', 'Orc', true);
}

export function spawnTroll(x: number, y: number): Entity {
   return new Entity(x, y, 'T', '#007f00', '#000', 'Troll', true);
}
```

The functions for spawning the troll and the orc will replace the print outs seen in the previous function and the
function for spawning a player, will be used in *main.ts* where the player instance is created.

### Seeing through walls
At this point, the enemies are always visible on screen, regardless if they are in the players field of view or not. To
fix this, the render function is updated according to:

```TypeScript
this.entities.forEach((e) => {
   if (this.tiles[e.y][e.x].visible) {
      this.display.draw(e.x, e.y, e.char, e.fg, e.bg);
   }
});
```

### Ghosts
Another feature of the enemy entities at the moment is that it is possible to walk directly through them. To fix this,
a property was added to the <code>Entity</code> class earlier: <code>blocksMovement</code>. Currently, it isn't
utilized at all. To change this, a method called <code>getBlockingEntityAtLocation</code> is added to the
<code>GameMap</code> class:

```TypeScript
// The '|' is used to say that a function/method can return different types. In this case, the find function will
// either return an Entity object or undefined, if no Entity fulfilling the criteria was found.
getBlockingEntityAtLocation(x: number, y: number): Entity | undefined {
   return this.entities.find(
      (e) => e.blocksMovement && e.x === x && e.y === y,
   );
}
```

### Punching
As part of making it possible for enemies to block the path of the player, some changes were made in the
*input-handler.ts* file. An abstract class called <code>ActionWithDirection</code> was created:

```TypeScript
export abstract class ActionWithDirection implements Action {
   constructor(public dx: number, public dy: number) {}

   perform(_engine: Engine, _entity: Entity) {}
}
```

This class was used to redefine the <code>MovementAction</code> class from earlier and will now be used to create two
new classes called <code>MeleeAction</code> and <code>BumpAction</code>:

```TypeScript
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
```

The class <code>BumpAction</code> will replace the <code><MovementAction</code>, that was currently mapped in the
variable <code>MOVE_KEYS</code>.

## Part 6 - Dealing and taking damage
The enemies on the map are at the moment not very interesting, considering that they don't really do anything but
stand still.

### Give chase
To enable the monster to move around, a design pattern called *composite pattern* will be used. An in depth explanation
to what it is can be found here: [Composite Pattern](https://refactoring.guru/design-patterns/composite). But the gist
of this pattern is to compose objects into tree structure to make it possible to work with these structures as if they
are individual objets. In our code, this will be implemented in a directory called *components*. For now, the folder
contains three files:

1. base-components.ts
2. figher.ts
3. ai.ts

The first file contains an interface definition called <code>BaseComponent</code>. The second file contains a class
called <code>Figher</code> that implements the beforementioned interface. This class will be used to keep track of the
hp of entities, alongside with other attributes. The third file contains an abstract class <code>BaseAI</code>, which
at the moment contains a function <code>calculatePathTo</code> that find the shortest path between two points using
Djikstras algorithm. The function can be seen below.

```TypeScript
calculatePathTo(destX: number, destY: number, entity: Entity) {
   // Lambda function to let Djikstra algorithm know if a tile can be walked on
   const isPassable = (x: number, y: number) => window.engine.gameMap.tiles[x][y].walkable;
   const dijkstra = new ROT.Path.Dijkstra(destX, destY, isPassable, {});

   this.path = [];

   // Provide callback function that saves each calculated path in 'this.path'
   dijkstra.compute(entity.x, entity.y, (x: number, y: number) => {
      this.path.push([x, y]);
   });

   // Since the starting point is included in the path, remove it from the array
   this.path.shift();
}
```

Since this is an abstract class it won't change the behaviour of the monsters on itself. To do so, a new class is
created, <code>HostileAI</code>. This class extends the BaseAI class and contains a function <code>perform</code> which
can be considered the "brain" of the AI. It selects a target (at the moment it is always the player) and attempts the
following steps (in the respective order):

1. If player is visible and within one square; perform melee action
2. If player is visible but not within one square; calculate the closest path
3. If a path to the target exists; perform a movement action
4. If neither of the conditions above are fulfilled; perform a wait action (no nothing)

Now that there is a class that implements the <ode>BaseAI</code> class, it can be used to make the enemies move. To do
so, and to maintain a good structure, the <code>Entity</code> class is extended with a class called <code>Actor</code>.
The code for it is nothing fancy and can be seen below.

```TypeScript
export class Actor extends Entity {
   constructor(
      /* Parameters common with Entity hidden */
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
```

The last step is to adapt all the existing code to use this <code>Actor</code> class instead of the previous
<code>Entity</code>. I won't go into the details but it involves updating the spawn functions in *entity-classes.ts* and
updating the <code>GameMap</code> class to return all non player actors so that the function
<code>handleEnemyTurns</code> can get access to them to "run" their AI.

### Dishing out punches
To make the hostile mobs capable of conflicting (and taking) damage, some refactoring is needed. I won't describe these
in detail since they aren't that interesting. But the two more imporant changes are to update the method
<code>MeleeAction</code> and to implement a method called <code>die</code> in the <code>fighter</code> class.
The <code>MeleeAction</code> is updated to find the target at the desired direction and then calculate the resulting
damage a hit would do when taking defense into account. The methid <code>die</code> is, unsurprisingly, called if an
actor dies. When an actor dies, a message is printed in the console and the visual representation on the map changes.

### Drawing priority
A dead actor logically doesn't float to the roof of a room, if gravity works as it should. This means, since this is a
top down game, a dead actor shouldn't be drawn on top of an actor that is less dead. Which is the case currently. To
remedy this, a rendering order is defined in *entity-classes.ts* according to:

```TypeScript
export enum RenderOrder {
   Corpse,
   Item,
   Actor
}
```

The class <code>Entity</code> is then extended with a new property of this type which defaults to *Corpse*.
This means that the class <code>Actor</code> inherints this property and can modify it to *Actor* instead. This is then
"downgraded" in the function <code>die</code>, from the previous section, to *Corpes* if the target dies. Lastly, to
make use of the rendering order, the <code>render</code> method, where objects are drawn on the map, is modified:

```
const sortedEntities = this.entities.slice().sort((a, b) => a.renderOrder - b.renderOrder);

sortedEntities.forEach((e) => {
   if (this.tiles[e.y][e.x].visible) {
      this.display.draw(e.x, e.y, e.char, e.fg, e.bg);
   }
});
```

This would make it iterate over the entities using the rendering order.

### Zombies
Another issue that needs to be resolved before wrapping chapter 6 up is the issue with the player being able to move
around after death. Fixing this is simple and is done by updating the <code>update</code> method in *engine.ts* to check
if the player is alive before allowing any actors to move. If the player is dead, nothing moves.

While whe're at it, we might as well ad the first piece of UI to the game. More specifically, how much life the player
has left. This information is added by modifying the <code>render</code> method in *engine.ts* like this:

```
render() {
   this.gameMap.render();

   this.display.drawText(
      1,
      47,
      `HP: %c{red}%b{white}${this.player.fighter.hp}/%c{green}%b{white}${this.player.fighter.maxHp}`,
   );
}
```

## Graphical assets
https://kenney.nl/assets/tiny-dungeon