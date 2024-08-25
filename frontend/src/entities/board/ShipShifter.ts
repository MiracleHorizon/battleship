import { Ship, ShipOrientation } from './figures/Ship'
import { Cell } from './Cell'
import { Fleet } from './Fleet'

interface Constructor {
  cellsMatrix: Cell[][]
  fleet: Fleet
  ship: Ship
  cell: Cell
  prev: number
  next: number
}

export class ShipShifter {
  private readonly cellsMatrix: Cell[][]
  private readonly ship: Ship
  private readonly fleet: Fleet
  // TODO: cell -> rotationCell
  private readonly cell: Cell
  private readonly next: number
  private readonly prev: number

  /**
   * @param cellsMatrix - matrix of cells on the board.
   * @param fleet - fleet of ships.
   * @param ship - ship to drag.
   * @param cell - cell on which the drop event was triggered.
   * @param prev - number of the previous cells to the target cell.
   * @param next - number of the next cells to the target cell.
   */
  constructor({ cellsMatrix, fleet, ship, cell, prev, next }: Constructor) {
    this.cellsMatrix = cellsMatrix
    this.fleet = fleet
    this.ship = ship
    this.cell = cell
    this.prev = prev
    this.next = next
  }

  public shift(): boolean {
    if (this.ship.orientation === ShipOrientation.HORIZONTAL) {
      return this.shiftHorizontalShip()
    } else {
      return this.shiftVerticalShip()
    }
  }

  private shiftHorizontalShip(): boolean {
    const right = this.next
    const left = this.prev

    for (let cellRow = 0; cellRow < this.cellsMatrix.length; cellRow++) {
      if (cellRow !== this.cell.row) {
        continue
      }

      const row = this.cellsMatrix[cellRow]

      for (let cellCol = 0; cellCol < row.length; cellCol++) {
        if (cellCol !== this.cell.column) {
          continue
        }
        if (this.cell.isReserved || cellCol + right > row.length - 1 || cellCol - left < 0) {
          return false
        }

        const cells: Cell[] = [this.cell]

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

        if (cells.length < this.ship.size) {
          return false
        }

        return this.placeShip(cells)
      }
    }

    return true
  }

  private shiftVerticalShip(): boolean {
    // TODO: Vertical
    console.log(this.ship, this.cell, this.prev, this.next)
    return true
  }

  private placeShip(cells: Cell[]): boolean {
    const isPlaced = this.fleet.placeShip(this.ship.id, cells)
    if (!isPlaced) {
      return false
    }

    if (this.ship.orientation === ShipOrientation.HORIZONTAL) {
      this.placeHorizontalShip(cells)
    } else {
      this.placeVerticalShip(cells)
    }

    return true
  }

  private placeHorizontalShip(cells: Cell[]): boolean {
    const firstCell = cells[0]

    for (let row = 0; row < this.cellsMatrix.length; row++) {
      if (firstCell.row !== row) continue

      // Cells reserving
      const lastCell = cells[cells.length - 1]

      // Previous row
      if (row !== 0) {
        const prevRow = this.cellsMatrix[row - 1]

        for (let col = 0; col < prevRow.length; col++) {
          const cell = prevRow[col]

          if (
            !cell.isPlaced &&
            cell.column >= firstCell.column - 1 &&
            cell.column <= lastCell.column + 1
          ) {
            cell.reserve(this.ship.id)
          }
        }
      }

      // Current row
      const currRow = this.cellsMatrix[row]
      for (let col = 0; col < currRow.length; col++) {
        const cell = currRow[col]

        // Reserve prev cell if exists
        if (cell.column === firstCell.column && cell.column !== 0) {
          const prevCell = currRow[col - 1]

          if (!prevCell.isPlaced) {
            prevCell.reserve(this.ship.id)
          }
        }

        // Reserve next cell if exists
        if (cell.column === lastCell.column && cell.column !== currRow.length - 1) {
          const nextCell = currRow[col + 1]

          if (!nextCell.isPlaced) {
            nextCell.reserve(this.ship.id)
          }
        }
      }

      // Next row
      if (row !== this.cellsMatrix.length - 1) {
        const nextRow = this.cellsMatrix[row + 1]

        for (let col = 0; col < nextRow.length; col++) {
          const cell = nextRow[col]

          if (
            !cell.isPlaced &&
            cell.column >= firstCell.column - 1 &&
            cell.column <= lastCell.column + 1
          ) {
            cell.reserve(this.ship.id)
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
