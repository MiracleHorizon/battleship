import { Ship, ShipOrientation, ShipType } from './Ship.ts'

export class Cruiser extends Ship {
  constructor(orientation: ShipOrientation) {
    super(3, orientation, ShipType.CRUISER)
  }
}
