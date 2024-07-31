import { Ship, ShipOrientation } from './figures/Ship.ts'
import { Cell } from './Cell.ts'
import { Fleet } from './Fleet.ts'

interface Constructor {
  cellMatrix: Cell[][]
  fleet: Fleet
  ship: Ship
}

export class ShipRotator {
  private readonly cellMatrix: Cell[][]
  private readonly fleet: Fleet
  private readonly ship: Ship

  constructor({ cellMatrix, fleet, ship }: Constructor) {
    this.cellMatrix = cellMatrix
    this.fleet = fleet
    this.ship = ship
  }

  public rotate(): boolean {
    if (this.ship.orientation === ShipOrientation.HORIZONTAL) {
      return this.rotateHorizontalShip()
    } else {
      return this.rotateVerticalShip()
    }
  }

  private rotateHorizontalShip(): boolean {
    /*
        | 0  0  0  0 |      | 0  0  0  0 |
        | 0  1  1  1 |      | 0  1  0  0 |
        | 0  0  0  0 |  ->  | 0  1  0  0 |
        | 0  0  0  0 |      | 0  1  0  0 |
        | 0  0  0  0 |      | 0  0  0  0 |
    */

    const shipCells = this.fleet.getShipCells(this.ship)
    const firstCell = shipCells[0] // TODO: Unshift?

    // Check that ship can be rotated.
    const newCells: Cell[] = []

    for (let row = firstCell.row; row < firstCell.row + this.ship.size; row++) {
      for (let col = 0; col < this.cellMatrix[row].length; col++) {
        if (col !== firstCell.column) continue

        const cell = this.cellMatrix[row][col]
        if (cell.id === firstCell.id) continue

        // The first ship cell is reserved for rotation, so skip it in manual mode.
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

    const lastCell = newCells[newCells.length - 1]
    const nextRow = this.cellMatrix[lastCell.row + 1]

    // Check if the last potential ship placement cell vertically has no cells occupied by another ship.
    for (const cell of nextRow) {
      if (cell.column !== firstCell.column - 1 && cell.column !== lastCell.column + 1) {
        continue
      }

      if (cell.isPlaced) {
        return false
      }
    }

    // If all expected cells are okay - place ship.
    for (const cell of newCells) {
      if (!cell.isEmpty) {
        cell.reset()
        cell.unreserve(this.ship.id)
      }
      cell.placeShip()
    }

    // Reset all reserved cells around the ship.
    for (let row = 0; row < this.cellMatrix.length; row++) {
      if (firstCell.row !== row) continue

      // Cells reset
      const lastCell = shipCells[shipCells.length - 1]

      // Previous row
      if (row !== 0) {
        const prevRow = this.cellMatrix[row - 1]

        for (let col = 0; col < prevRow.length; col++) {
          const cell = prevRow[col]

          if (
            !cell.isEmpty &&
            cell.column >= firstCell.column - 1 &&
            cell.column <= lastCell.column + 1
          ) {
            cell.reset()
            cell.unreserve(this.ship.id)
          }
        }
      }

      // Current row
      const currRow = this.cellMatrix[row]
      for (let col = 0; col < currRow.length; col++) {
        const cell = currRow[col]

        // Reset prev cell if exists
        if (cell.column === firstCell.column && cell.column !== 0) {
          const prevCell = currRow[col - 1]

          if (!prevCell.isEmpty) {
            prevCell.unreserve(this.ship.id)
            prevCell.reset()
          }
        }

        // Reset next cell if exists
        if (cell.column === lastCell.column && cell.column !== currRow.length - 1) {
          const nextCell = currRow[col + 1]

          if (!nextCell.isEmpty) {
            nextCell.reset()
            nextCell.unreserve(this.ship.id)
          }
        }
      }

      // Next row
      if (row !== this.cellMatrix.length - 1) {
        const nextRow = this.cellMatrix[row + 1]

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
            cell.unreserve(this.ship.id)
          }
        }
      }
    }

    // Reset previous ship cells, except first.
    for (let i = 0; i < shipCells.length; i++) {
      if (i === 0) continue

      const cell = shipCells[i]

      cell.reset()
      cell.unreserve(this.ship.id)
    }

    // Reserve new cells around the ship.
    for (let row = firstCell.row; row < firstCell.row + this.ship.size; row++) {
      // Prev row
      if (row === firstCell.row && row !== 0) {
        const prevRow = this.cellMatrix[row - 1]

        for (let col = 0; col < prevRow.length; col++) {
          const cell = prevRow[col]

          if (cell.column >= firstCell.column - 1 && cell.column <= firstCell.column + 1) {
            cell.reserve(this.ship.id)
          }
        }
      }

      // Rows around the ship.
      const currRow = this.cellMatrix[row]
      for (let col = 0; col < currRow.length; col++) {
        const cell = currRow[col]

        if (cell.column === firstCell.column - 1 || cell.column === firstCell.column + 1) {
          cell.reserve(this.ship.id)
        }
      }

      // Next row.
      if (row === firstCell.row + this.ship.size - 1 && row !== this.cellMatrix.length - 1) {
        const nextRow = this.cellMatrix[row + 1]

        for (let col = 0; col < nextRow.length; col++) {
          const cell = nextRow[col]

          if (cell.column >= firstCell.column - 1 && cell.column <= firstCell.column + 1) {
            cell.reserve(this.ship.id)
          }
        }
      }
    }

    this.ship.rotate()

    return true
  }

  private rotateVerticalShip(): boolean {
    /*
        | 0  0  0  0 |      | 0  0  0  0 |
        | 0  1  0  0 |      | 0  1  1  1 |
        | 0  1  0  0 |  ->  | 0  0  0  0 |
        | 0  1  0  0 |      | 0  0  0  0 |
        | 0  0  0  0 |      | 0  0  0  0 |
    */

    return false
  }
}
