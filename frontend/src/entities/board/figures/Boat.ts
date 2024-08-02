import { Ship, ShipOrientation, ShipType } from './Ship.ts'

export class Boat extends Ship {
  constructor(orientation: ShipOrientation) {
    super(1, orientation, ShipType.BOAT)
  }
}
