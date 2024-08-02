import { Ship, ShipOrientation, ShipType } from './Ship.ts'

export class Battleship extends Ship {
  constructor(orientation: ShipOrientation) {
    super(4, orientation, ShipType.BATTLESHIP)
  }
}
