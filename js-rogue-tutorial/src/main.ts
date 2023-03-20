import { Actor, spawnPlayer } from './entity-classes';
import { Engine } from './engine';

declare global {
   interface Window {
      engine: Engine;
   }
}

window.addEventListener('DOMContentLoaded', () => {
   const player = spawnPlayer(Engine.MAP_WIDTH, Engine.MAP_HEIGHT);
   window.engine = new Engine(player as Actor);
});