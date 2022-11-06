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

export const FLOOR_TILE: Tile = {
   walkable: true,
   transparent: true,
   dark: { char: ' ', fg: '#fff', bg: '#000'}
};

export const WALL_TILE: Tile = {
   walkable: false,
   transparent: false,
   dark: { char: ' ', fg: '#fff', bg: '#000064'}
};