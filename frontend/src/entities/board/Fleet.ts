import { Cell } from './Cell.ts'
import { Carrier } from './figures/Carrier.ts'
import { Battleship } from './figures/Battleship.ts'
import { Cruiser } from './figures/Cruiser.ts'
import { Destroyer } from './figures/Destroyer.ts'
import { Boat } from './figures/Boat.ts'
import { type Ship, ShipOrientation } from './figures/Ship.ts'

type FleetShip = Carrier | Battleship | Cruiser | Destroyer | Boat

export class Fleet {
  private readonly CARRIES_COUNT: number = 1
  private readonly BATTLESHIPS_COUNT: number = 1
  private readonly CRUISERS_COUNT: number = 2
  private readonly DESTROYERS_COUNT: number = 3
  private readonly BOATS_COUNT: number = 4

  private readonly ships: FleetShip[]
  private readonly destroyedShips: FleetShip[]

  public carries: Carrier[] = []
  public battleships: Battleship[] = []
  public cruisers: Cruiser[] = []
  public destroyers: Destroyer[] = []
  public boats: Boat[] = []

  constructor() {
    this.create()

    this.ships = [
      ...this.carries,
      ...this.battleships,
      ...this.cruisers,
      ...this.destroyers,
      ...this.boats
    ]
    this.destroyedShips = []
  }

  private create(): void {
    this.createCarriers()
    this.createBattleships()
    this.createCruisers()
    this.createDestroyers()
    this.createBoats()
  }

  private createCarriers(): void {
    const carriers: Carrier[] = []

    for (let i = 0; i < this.CARRIES_COUNT; i++) {
      const carrier = new Carrier(ShipOrientation.HORIZONTAL)
      carriers.push(carrier)
    }

    this.carries = carriers
  }

  private createBattleships(): void {
    const battleships: Battleship[] = []

    for (let i = 0; i < this.BATTLESHIPS_COUNT; i++) {
      const battleship = new Battleship(ShipOrientation.HORIZONTAL)
      battleships.push(battleship)
    }

    this.battleships = battleships
  }

  private createCruisers(): void {
    const cruisers: Cruiser[] = []

    for (let i = 0; i < this.CRUISERS_COUNT; i++) {
      const cruiser = new Cruiser(ShipOrientation.HORIZONTAL)
      cruisers.push(cruiser)
    }

    this.cruisers = cruisers
  }

  private createDestroyers(): void {
    const destroyers: Destroyer[] = []

    for (let i = 0; i < this.DESTROYERS_COUNT; i++) {
      const destroyer = new Destroyer(ShipOrientation.HORIZONTAL)
      destroyers.push(destroyer)
    }

    this.destroyers = destroyers
  }

  private createBoats(): void {
    const boats: Boat[] = []

    for (let i = 0; i < this.BOATS_COUNT; i++) {
      const boat = new Boat(ShipOrientation.HORIZONTAL)
      boats.push(boat)
    }

    this.boats = boats
  }

  public placeShip(shipId: string, cells: Cell[]): boolean {
    for (const ship of this.ships) {
      if (ship.id !== shipId) {
        continue
      }

      // TODO: Checkout
      ship.place(cells)

      return true
    }

    return false
  }

  public reset(): void {
    for (const ship of this.ships) {
      ship.unplace()
    }
  }

  // TODO: Improve time complexity? Currently - O(n * m)
  public hitOrMiss(cellToHit: Cell): boolean {
    for (const ship of this.ships) {
      for (const cell of ship.cells) {
        if (cell.id === cellToHit.id) {
          const isDestroyed = ship.hit(cell)

          if (isDestroyed) {
            this.destroyedShips.push(ship)
          }

          return true
        }
      }
    }

    cellToHit.miss()
    return false
  }

  public getShipCells(s: Ship): Cell[] {
    for (const ship of this.ships) {
      if (ship.id === s.id) {
        return ship.cells
      }
    }

    return []
  }
}