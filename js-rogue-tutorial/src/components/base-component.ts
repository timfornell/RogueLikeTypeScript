import { Entity } from "../entity-classes";

export interface BaseComponent {
   // Entity can either be null or an Entity object
   entity: Entity | null;
}