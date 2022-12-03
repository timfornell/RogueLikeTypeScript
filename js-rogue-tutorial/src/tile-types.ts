export interface Graphic {
   char: string; // Display character
   fg: string; // Foreground color
   bg: string; // Background color
};

export interface Tile {
   walkable: boolean;
   transparent: boolean; // If see-through
   visible: boolean; // If block can be seen by player
   seen: boolean; // If blocke has previously been seeen by player
   dark: Graphic; // What to draw if not in field of view
   light: Graphic; // What to draw if block is in field of view
};

export const FLOOR_TILE: Tile = {
   walkable: true,
   transparent: true,
   visible: false,
   seen: false,
   dark: { char: ' ', fg: '#fff', bg: '#000'},
   light: { char: ' ', fg: '#fff', bg: '#c8b432'}
};

export const WALL_TILE: Tile = {
   walkable: false,
   transparent: false,
   visible: false,
   seen: false,
   dark: { char: ' ', fg: '#fff', bg: '#000064'},
   light: { char: ' ', fg: '#fff', bg: '#826e32'}
};