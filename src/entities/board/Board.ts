import { Cell } from './Cell.ts'
import { Fleet } from './Fleet.ts'
import { Ship } from './figures/Ship.ts'
import { GameMode } from './GameMode.enum.ts'
import { ShipShifter } from './ShipShifter.ts'
import { ShipRotator } from './ShipRotator.ts'

export class Board {
  private readonly BOARD_SIZE: number = 10
  private isGameStarted: boolean

  public readonly cells: Cell[][]
  public readonly fleet: Fleet

  public get gameStarted(): boolean {
    return this.isGameStarted
  }

  constructor() {
    this.cells = this.createCells()
    this.fleet = new Fleet(GameMode.CLASSIC)
    this.isGameStarted = false
  }

  private createCells(): Cell[][] {
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

  public startGame(): void {
    this.isGameStarted = true
  }

  public endGame(): void {
    this.isGameStarted = false
    this.fleet.reset()
  }

  public hitOrMiss(cell: Cell): boolean {
    /*
     * Shots can only be thrown after the game has started.
     */
    if (!this.isGameStarted) {
      return false
    }

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
    /*
     * Ships can be placed only when the game is not started.
     */
    if (this.isGameStarted) {
      return false
    }

    const shipShifter = new ShipShifter({
      cellMatrix: this.cells,
      fleet: this.fleet,
      ship,
      cell,
      prev,
      next
    })

    return shipShifter.shift()
  }

  public rotateShip(ship: Ship): boolean {
    /*
     * Ships can be rotated only when the game is not started.
     */
    if (this.isGameStarted) {
      return false
    }

    if (ship.size === 1) {
      return true
    }

    const shipRotator = new ShipRotator({
      cellMatrix: this.cells,
      fleet: this.fleet,
      ship
    })

    return shipRotator.rotate()
  }
}
