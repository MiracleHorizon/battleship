import { Ship, ShipOrientation, ShipType } from './Ship.ts'

export class Carrier extends Ship {
  constructor(orientation: ShipOrientation) {
    super(5, orientation, ShipType.CARRIER)
  }
}
