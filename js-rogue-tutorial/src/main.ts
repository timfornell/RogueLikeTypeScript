import { Entity, Player } from './entity-classes';
import { Engine } from './engine';

declare global {
   interface Window {
      engine: Engine;
   }
}

window.addEventListener('DOMContentLoaded', () => {
   const npc = new Entity(Engine.MAP_WIDTH / 2 - 5, Engine.MAP_HEIGHT / 2, '#', '#ff0');
   const player = new Player(Engine.MAP_WIDTH / 2, Engine.MAP_HEIGHT / 2);
   const entities = [npc, player];
   window.engine = new Engine(entities, player);
});