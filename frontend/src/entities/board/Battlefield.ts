import { Cell } from './Cell.ts'
import { Fleet } from './Fleet.ts'
import { Ship } from './figures/Ship.ts'
import { ShipShifter } from './ShipShifter.ts'
import { ShipRotator } from './ShipRotator.ts'

export class Battlefield {
  private readonly BOARD_SIZE: number = 10

  public readonly cellsMatrix: Cell[][]
  public readonly fleet: Fleet

  public get matrix(): number[][] {
    const matrix: number[][] = []

    for (const row of this.cellsMatrix) {
      const newRow: number[] = []

      for (const cell of row) {
        newRow.push(Number(cell.isPlaced))
      }

      matrix.push(newRow)
    }

    return matrix
  }

  constructor() {
    this.cellsMatrix = this.createCellsMatrix()
    this.fleet = new Fleet()
  }

  private createCellsMatrix(): Cell[][] {
    const cells: Cell[][] = []

    for (let i = 0; i < this.BOARD_SIZE; i++) {
      const row = []

      for (let j = 0; j < this.BOARD_SIZE; j++) {
        const cell = new Cell(j, i)
        row.push(cell)
      }

      cells.push(row)
    }

    return cells
  }

  public hitOrMiss(cell: Cell): boolean {
    return this.fleet.hitOrMiss(cell)
  }

  /**
   * @param ship - ship to drag.
   * @param cell - cell on which the drop event was triggered.
   * @param prev - number of the previous cells to the target cell.
   * @param next - number of the next cells to the target cell.
   * @returns {true} if the ship can be successfully placed.
   */
  // TODO: Rename?
  public dropShip(ship: Ship, cell: Cell, prev: number, next: number): boolean {
    const shipShifter = new ShipShifter({
      cellsMatrix: this.cellsMatrix,
      fleet: this.fleet,
      ship,
      cell,
      prev,
      next
    })

    return shipShifter.shift()
  }

  public rotateShip(ship: Ship): boolean {
    if (ship.size === 1) {
      return true
    }

    const shipRotator = new ShipRotator({
      cellsMatrix: this.cellsMatrix,
      fleet: this.fleet,
      ship
    })

    return shipRotator.rotate()
  }
}
