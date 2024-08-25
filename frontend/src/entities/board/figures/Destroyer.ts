import { Ship, ShipOrientation, ShipType } from './Ship.ts'

export class Destroyer extends Ship {
  constructor(orientation: ShipOrientation) {
    super(2, orientation, ShipType.DESTROYER)
  }
}
