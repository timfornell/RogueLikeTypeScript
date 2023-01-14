import { Entity, Player } from './entity-classes';
import { Engine } from './engine';

declare global {
   interface Window {
      engine: Engine;
   }
}

window.addEventListener('DOMContentLoaded', () => {
   const player = new Player(Engine.MAP_WIDTH / 2, Engine.MAP_HEIGHT / 2);
   window.engine = new Engine(player);
});