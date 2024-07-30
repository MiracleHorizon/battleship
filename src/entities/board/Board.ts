import { Cell } from './Cell.ts'
import { Fleet } from './Fleet.ts'
import { Ship } from './figures/Ship.ts'
import { GameMode } from './GameMode.enum.ts'

export class Board {
  private isGameStarted: boolean
  private readonly cells: Cell[][]
  private readonly fleet: Fleet

  public getCells(): Cell[][] {
    return this.cells
  }

  public getFleet(): Fleet {
    return this.fleet
  }

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
   * @param left - number of cells to the left of the target cell
   * @param right - number of cells to the right of the target cell
   * @returns {true} if the ship can be successfully placed
   */
  public dropShip(ship: Ship, cell: Cell, left: number, right: number): boolean {
    // Horizontal
    for (let cellRow = 0; cellRow < this.cells.length; cellRow++) {
      if (cellRow !== cell.row) {
        continue
      }

      const row = this.cells[cellRow]

      for (let cellCol = 0; cellCol < row.length; cellCol++) {
        if (cellCol !== cell.column) {
          continue
        }
        if (cellCol + right > row.length - 1 || cellCol - left < 0) {
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

        this.placeShip(ship.id, cells)
      }
    }

    // TODO: Vertical

    return true
  }

  private placeShip(shipId: string, cells: Cell[]): boolean {
    if (!this.isGameStarted) {
      return false
    }

    const isPlaced = this.fleet.placeShip(shipId, cells)
    if (!isPlaced) {
      return false
    }

    // Horizontal
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

          if (cell.column >= firstCell.column - 1 && cell.column <= lastCell.column + 1) {
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
          prevCell.reserve()
        }

        // Reserve next cell if exists
        if (cell.column === lastCell.column && cell.column !== currRow.length - 1) {
          const nextCell = currRow[col + 1]
          nextCell.reserve()
        }
      }

      // Next row
      if (row !== this.cells.length - 1) {
        const nextRow = this.cells[row + 1]

        for (let col = 0; col < nextRow.length; col++) {
          const cell = nextRow[col]

          if (cell.column >= firstCell.column - 1 && cell.column <= lastCell.column + 1) {
            cell.reserve()
          }
        }
      }
    }

    // TODO: Vertical

    return true
  }
}
