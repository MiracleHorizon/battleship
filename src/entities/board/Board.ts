import { Cell } from './Cell.ts'
import { Fleet } from './Fleet.ts'
import { Ship, ShipOrientation } from './figures/Ship.ts'
import { GameMode } from './GameMode.enum.ts'
import { ShipShifter } from './ShipShifter.ts'

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

    if (ship.orientation === ShipOrientation.HORIZONTAL) {
      return this.rotateHorizontalShip(ship)
    } else {
      return this.rotateVerticalShip()
    }
  }

  private rotateHorizontalShip(ship: Ship): boolean {
    /*
        | 0  0  0  0 |      | 0  0  0  0 |
        | 0  1  1  1 |      | 0  1  0  0 |
        | 0  0  0  0 |  ->  | 0  1  0  0 |
        | 0  0  0  0 |      | 0  1  0  0 |
        | 0  0  0  0 |      | 0  0  0  0 |
    */

    const shipCells = this.fleet.getShipCells(ship)
    const firstCell = shipCells[0] // TODO: Unshift?

    // Check that ship can be rotated
    const newCells: Cell[] = []
    for (let row = firstCell.row; row < firstCell.row + ship.size; row++) {
      for (let col = 0; col < this.cells[row].length; col++) {
        if (col !== firstCell.column) continue

        const cell = this.cells[row][col]
        if (cell.id === firstCell.id) continue

        // Эта клетка зарезервирована, поэтому ее нужно пропустить в ручном режиме
        if (cell.row === firstCell.row + 1) {
          newCells.push(cell)
          continue
        }

        // TODO: Comment
        if (!cell.isEmpty) {
          return false
        }
        newCells.push(cell)
      }
    }
    for (const cell of newCells) {
      if (!cell.isEmpty) {
        cell.reset()
        cell.unreserve(ship.id)
      }
      cell.placeShip()
    }

    // Reset all reserved cells around the ship
    for (let row = 0; row < this.cells.length; row++) {
      if (firstCell.row !== row) continue

      // Cells reset
      const lastCell = shipCells[shipCells.length - 1]

      // Previous row
      if (row !== 0) {
        const prevRow = this.cells[row - 1]

        for (let col = 0; col < prevRow.length; col++) {
          const cell = prevRow[col]

          if (
            !cell.isEmpty &&
            cell.column >= firstCell.column - 1 &&
            cell.column <= lastCell.column + 1
          ) {
            cell.reset()
            cell.unreserve(ship.id)
          }
        }
      }

      // Current row
      const currRow = this.cells[row]
      for (let col = 0; col < currRow.length; col++) {
        const cell = currRow[col]

        // Reset prev cell if exists
        if (cell.column === firstCell.column && cell.column !== 0) {
          const prevCell = currRow[col - 1]

          if (!prevCell.isEmpty) {
            prevCell.unreserve(ship.id)
            prevCell.reset()
          }
        }

        // Reset next cell if exists
        if (cell.column === lastCell.column && cell.column !== currRow.length - 1) {
          const nextCell = currRow[col + 1]

          if (!nextCell.isEmpty) {
            nextCell.reset()
            nextCell.unreserve(ship.id)
          }
        }
      }

      // Next row
      if (row !== this.cells.length - 1) {
        const nextRow = this.cells[row + 1]

        for (let col = 0; col < nextRow.length; col++) {
          const cell = nextRow[col]

          if (cell.row === firstCell.row + 1 && cell.column === firstCell.column) {
            continue
          }

          if (
            !cell.isEmpty &&
            cell.column >= firstCell.column - 1 &&
            cell.column <= lastCell.column + 1
          ) {
            cell.reset()
            cell.unreserve(ship.id)
          }
        }
      }
    }

    // Reset previous ship cells, except first
    for (let i = 0; i < shipCells.length; i++) {
      if (i === 0) continue

      const cell = shipCells[i]

      cell.reset()
      cell.unreserve(ship.id)
    }

    // Reserve new cells around the ship
    for (let row = firstCell.row; row < firstCell.row + ship.size; row++) {
      // Prev row
      if (row === firstCell.row && row !== 0) {
        const prevRow = this.cells[row - 1]

        for (let col = 0; col < prevRow.length; col++) {
          const cell = prevRow[col]

          if (cell.column >= firstCell.column - 1 && cell.column <= firstCell.column + 1) {
            cell.reserve(ship.id)
          }
        }
      }

      // Rows around the ship
      const currRow = this.cells[row]
      for (let col = 0; col < currRow.length; col++) {
        const cell = currRow[col]

        if (cell.column === firstCell.column - 1 || cell.column === firstCell.column + 1) {
          cell.reserve(ship.id)
        }
      }

      // Next row
      if (row === firstCell.row + ship.size - 1 && row !== this.cells.length - 1) {
        const nextRow = this.cells[row + 1]

        for (let col = 0; col < nextRow.length; col++) {
          const cell = nextRow[col]

          if (cell.column >= firstCell.column - 1 && cell.column <= firstCell.column + 1) {
            cell.reserve(ship.id)
          }
        }
      }
    }

    ship.rotate()

    return true
  }

  private rotateVerticalShip(): boolean {
    return false
  }
}
