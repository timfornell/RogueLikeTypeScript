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

## Graphical assets
https://kenney.nl/assets/tiny-dungeon