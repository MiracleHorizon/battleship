import { Cell } from './Cell.ts'
import { Fleet } from './Fleet.ts'
import { Ship, ShipOrientation } from './figures/Ship.ts'
import { GameMode } from './GameMode.enum.ts'

export class Board {
  private isGameStarted: boolean

  public readonly cells: Cell[][]
  public readonly fleet: Fleet

  constructor() {
    this.cells = this.createCells()
    this.fleet = new Fleet(GameMode.CLASSIC)
    this.isGameStarted = false
  }

  private createCells(): Cell[][] {
    const cells: Cell[][] = []

    for (let i = 0; i < 10; i++) {
      const row = []

      for (let j = 0; j < 10; j++) {
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
    if (!this.isGameStarted) {
      return false
    }

    return this.fleet.hitOrMiss(cell)
  }

  // TODO: Rename?
  /**
   * @param ship - ship to drag
   * @param cell - cell on which the drop event was triggered
   * @param prev - number of the previous cells to the target cell
   * @param next - number of the next cells to the target cell
   * @returns {true} if the ship can be successfully placed
   */
  public dropShip(ship: Ship, cell: Cell, prev: number, next: number): boolean {
    if (ship.orientation === ShipOrientation.HORIZONTAL) {
      return this.dropHorizontalShip(ship, cell, prev, next)
    } else {
      return this.dropVerticalShip(ship, cell, prev, next)
    }
  }

  private dropHorizontalShip(ship: Ship, cell: Cell, left: number, right: number): boolean {
    for (let cellRow = 0; cellRow < this.cells.length; cellRow++) {
      if (cellRow !== cell.row) {
        continue
      }

      const row = this.cells[cellRow]

      for (let cellCol = 0; cellCol < row.length; cellCol++) {
        if (cellCol !== cell.column) {
          continue
        }
        if (cell.isReserved || cellCol + right > row.length - 1 || cellCol - left < 0) {
          return false
        }

        const cells: Cell[] = [cell]

        // Prev cells
        let pointer = cellCol - 1
        while (pointer >= cellCol - left) {
          const prevCell = row[pointer--]

          if (!prevCell.isEmpty) {
            return false
          }

          cells.unshift(prevCell)
        }

        // Next cells
        pointer = cellCol + 1
        while (pointer <= cellCol + right) {
          const nextCell = row[pointer++]

          if (!nextCell.isEmpty) {
            return false
          }

          cells.push(nextCell)
        }

        if (cells.length < ship.size) {
          return false
        }

        this.placeShip(ship, cells)
      }
    }

    return true
  }

  private dropVerticalShip(ship: Ship, cell: Cell, top: number, bottom: number): boolean {
    // TODO: Vertical
    console.log(ship, cell, top, bottom)
    return true
  }

  private placeShip(ship: Ship, cells: Cell[]): boolean {
    if (!this.isGameStarted) {
      return false
    }

    // TODO: ???
    const isPlaced = this.fleet.placeShip(ship.id, cells)
    if (!isPlaced) {
      return false
    }

    if (ship.orientation === ShipOrientation.HORIZONTAL) {
      this.placeHorizontalShip(cells)
    } else {
      this.placeVerticalShip(cells)
    }

    return true
  }

  private placeHorizontalShip(cells: Cell[]): boolean {
    for (let row = 0; row < this.cells.length; row++) {
      const firstCell = cells[0]
      if (firstCell.row !== row) {
        continue
      }

      // Cells reserving
      const lastCell = cells[cells.length - 1]

      // Previous row
      if (row !== 0) {
        const prevRow = this.cells[row - 1]

        for (let col = 0; col < prevRow.length; col++) {
          const cell = prevRow[col]

          if (
            cell.isEmpty &&
            cell.column >= firstCell.column - 1 &&
            cell.column <= lastCell.column + 1
          ) {
            cell.reserve()
          }
        }
      }

      // Current row
      const currRow = this.cells[row]
      for (let col = 0; col < currRow.length; col++) {
        const cell = currRow[col]

        // Reserve prev cell if exists
        if (cell.column === firstCell.column && cell.column !== 0) {
          const prevCell = currRow[col - 1]

          if (prevCell.isEmpty) {
            prevCell.reserve()
          }
        }

        // Reserve next cell if exists
        if (cell.column === lastCell.column && cell.column !== currRow.length - 1) {
          const nextCell = currRow[col + 1]

          if (nextCell.isEmpty) {
            nextCell.reserve()
          }
        }
      }

      // Next row
      if (row !== this.cells.length - 1) {
        const nextRow = this.cells[row + 1]

        for (let col = 0; col < nextRow.length; col++) {
          const cell = nextRow[col]

          if (
            cell.isEmpty &&
            cell.column >= firstCell.column - 1 &&
            cell.column <= lastCell.column + 1
          ) {
            cell.reserve()
          }
        }
      }
    }

    return true
  }

  private placeVerticalShip(cells: Cell[]): boolean {
    console.log(cells)

    return true
  }
}
