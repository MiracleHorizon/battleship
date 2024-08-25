import { Ship, ShipOrientation } from './figures/Ship.ts'
import { Cell } from './Cell.ts'
import { Fleet } from './Fleet.ts'

interface Constructor {
  cellsMatrix: Cell[][]
  fleet: Fleet
  ship: Ship
}

export class ShipRotator {
  private readonly cellsMatrix: Cell[][]
  private readonly fleet: Fleet
  private readonly ship: Ship

  constructor({ cellsMatrix, fleet, ship }: Constructor) {
    this.cellsMatrix = cellsMatrix
    this.fleet = fleet
    this.ship = ship
  }

  public rotate(): boolean {
    if (this.ship.orientation === ShipOrientation.HORIZONTAL) {
      return this.horizontalToVertical()
    } else {
      return this.verticalToHorizontal()
    }
  }

  private horizontalToVertical(): boolean {
    /*
        | 0  0  0  0 |      | 0  0  0  0 |
        | 0  1  1  1 |      | 0  1  0  0 |
        | 0  0  0  0 |  ->  | 0  1  0  0 |
        | 0  0  0  0 |      | 0  1  0  0 |
        | 0  0  0  0 |      | 0  0  0  0 |
    */

    const shipCells = this.fleet.getShipCells(this.ship)
    const firstCell = shipCells[0]

    if (firstCell.row + this.ship.size > this.cellsMatrix[firstCell.row].length) {
      return false
    }

    // Check that ship can be rotated.
    const newCells: Cell[] = []
    const lastRow = Math.min(firstCell.row + this.ship.size, this.cellsMatrix[firstCell.row].length)

    for (let row = firstCell.row; row < lastRow; row++) {
      for (let col = 0; col < this.cellsMatrix[row].length; col++) {
        if (col !== firstCell.column) continue

        const cell = this.cellsMatrix[row][col]
        if (cell.id === firstCell.id) continue

        // The next cell of first ship cell is reserved, so skip it in manual mode.
        if (cell.row === firstCell.row + 1) {
          newCells.push(cell)
          continue
        }

        if (!cell.isEmpty) {
          return false
        }
        newCells.push(cell)
      }
    }

    const lastCell = newCells[newCells.length - 1]
    const nextRow = this.cellsMatrix[lastCell.row + 1]

    // Check if the last potential ship placement cell diagonally has no cells reserved by another ship.
    if (nextRow) {
      for (const cell of nextRow) {
        if (cell.column !== firstCell.column - 1 && cell.column !== lastCell.column + 1) {
          continue
        }

        if (cell.isPlaced) {
          return false
        }
      }
    }

    this.placeShipToNewCells(newCells)

    // Unreserve all reserved cells around the ship.
    // TODO: Бежать не по всей матрице
    for (let row = 0; row < this.cellsMatrix.length; row++) {
      if (firstCell.row !== row) continue

      // Cells reset
      const lastCell = shipCells[shipCells.length - 1]

      // Previous row
      if (row !== 0) {
        const prevRow = this.cellsMatrix[row - 1]

        for (let col = 0; col < prevRow.length; col++) {
          const cell = prevRow[col]

          if (
            !cell.isEmpty &&
            cell.column >= firstCell.column - 1 &&
            cell.column <= lastCell.column + 1
          ) {
            const isReserved = cell.unreserve(this.ship.id)
            if (!isReserved) {
              cell.reset()
            }
          }
        }
      }

      // Current row
      const currRow = this.cellsMatrix[row]
      for (let col = 0; col < currRow.length; col++) {
        const cell = currRow[col]

        // Reset prev cell if exists
        if (cell.column === firstCell.column && cell.column !== 0) {
          const prevCell = currRow[col - 1]

          if (!prevCell.isEmpty) {
            const isReserved = prevCell.unreserve(this.ship.id)
            if (!isReserved) {
              prevCell.reset()
            }
          }
        }

        // Reset next cell if exists
        if (cell.column === lastCell.column && cell.column !== currRow.length - 1) {
          const nextCell = currRow[col + 1]

          if (!nextCell.isEmpty) {
            const isReserved = nextCell.unreserve(this.ship.id)
            if (!isReserved) {
              nextCell.reset()
            }
          }
        }
      }

      // Next row
      if (row !== this.cellsMatrix.length - 1) {
        const nextRow = this.cellsMatrix[row + 1]

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
            const isReserved = cell.unreserve(this.ship.id)
            if (!isReserved) {
              cell.reset()
            }
          }
        }
      }
    }

    this.resetShipPreviousCells(shipCells)

    // Reserve new cells around the ship.
    for (let row = firstCell.row; row < firstCell.row + this.ship.size; row++) {
      // Prev row
      if (row === firstCell.row && row !== 0) {
        const prevRow = this.cellsMatrix[row - 1]

        for (let col = 0; col < prevRow.length; col++) {
          const cell = prevRow[col]

          if (cell.column >= firstCell.column - 1 && cell.column <= firstCell.column + 1) {
            cell.reserve(this.ship.id)
          }
        }
      }

      // Rows around the ship.
      const currRow = this.cellsMatrix[row]
      for (let col = 0; col < currRow.length; col++) {
        const cell = currRow[col]

        if (cell.column === firstCell.column - 1 || cell.column === firstCell.column + 1) {
          cell.reserve(this.ship.id)
        }
      }

      // Next row.
      if (row === firstCell.row + this.ship.size - 1 && row !== this.cellsMatrix.length - 1) {
        const nextRow = this.cellsMatrix[row + 1]

        for (let col = 0; col < nextRow.length; col++) {
          const cell = nextRow[col]

          if (cell.column >= firstCell.column - 1 && cell.column <= firstCell.column + 1) {
            cell.reserve(this.ship.id)
          }
        }
      }
    }

    this.ship.rotate(newCells)

    return true
  }

  private verticalToHorizontal(): boolean {
    /*
        | 0  0  0  0 |      | 0  0  0  0 |
        | 0  1  0  0 |      | 0  1  1  1 |
        | 0  1  0  0 |  ->  | 0  0  0  0 |
        | 0  1  0  0 |      | 0  0  0  0 |
        | 0  0  0  0 |      | 0  0  0  0 |
    */

    const shipCells = this.fleet.getShipCells(this.ship)
    const firstCell = shipCells[0]
    const lastCell = shipCells[shipCells.length - 1]
    const rowLength = this.cellsMatrix[firstCell.row].length
    const colLength = rowLength

    if (firstCell.column + this.ship.size > rowLength) {
      return false
    }

    // Check that ship can be rotated.
    const newCells: Cell[] = []
    for (let col = firstCell.column; col < firstCell.column + this.ship.size; col++) {
      const cell = this.cellsMatrix[firstCell.row][col]

      if (cell.id === firstCell.id) continue

      // The first ship cell is reserved for rotation, so skip it in manual mode.
      if (cell.column === firstCell.column + 1) {
        newCells.push(cell)
        continue
      }

      if (!cell.isEmpty) {
        return false
      }
      newCells.push(cell)
    }

    const prevRow = Math.max(firstCell.row - 1, 0)
    const prevCol = Math.max(firstCell.column - 1, 0)

    // Unreserve all reserved cells around the ship.
    const lastRow = Math.min(lastCell.row + 1, rowLength - 1) + 1

    for (let row = prevRow; row < lastRow; row++) {
      for (let col = prevCol; col <= firstCell.column + 1; col++) {
        const cell = this.cellsMatrix[row][col]

        if (!cell.isPlaced) {
          const isReserved = cell.unreserve(this.ship.id)
          if (!isReserved) {
            cell.reset()
          }
        }
      }
    }

    this.resetShipPreviousCells(shipCells)
    this.placeShipToNewCells(newCells)
    this.ship.rotate(newCells)

    // Reserve new cells around the ship.
    const lastCol = Math.min(firstCell.column + this.ship.size, colLength - 1)

    for (let row = prevRow; row <= firstCell.row + 1; row++) {
      for (let col = prevCol; col <= lastCol; col++) {
        const cell = this.cellsMatrix[row][col]

        if (!cell.isPlaced) {
          cell.reserve(this.ship.id)
        }
      }
    }

    return true
  }

  /**
   * If all expected cells are okay - place the ship.
   * @param newCells - new cells to place the ship.
   */
  private placeShipToNewCells(newCells: Cell[]): void {
    for (const cell of newCells) {
      if (!cell.isPlaced) {
        const isReserved = cell.unreserve(this.ship.id)
        if (!isReserved) {
          cell.reset()
        }
      }

      cell.placeShip()
    }
  }

  /**
   * Reset all previous ship cells except the first one.
   * @param cells - previous ship`s cells.
   */
  private resetShipPreviousCells(cells: Cell[]): void {
    for (let i = 1; i < cells.length; i++) {
      const cell = cells[i]

      const isReserved = cell.unreserve(this.ship.id)
      if (!isReserved) {
        cell.reset()
      }
    }
  }
}
