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
      return this.horizontalToVertical()
    } else {
      return this.verticalToHorizontal()
    }
  }

  // TODO: Проверка на то, хватает ли снизу вообще клеток
  private horizontalToVertical(): boolean {
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
    const lastRow = Math.min(firstCell.row + this.ship.size, this.cellMatrix[firstCell.row].length)

    for (let row = firstCell.row; row < lastRow; row++) {
      for (let col = 0; col < this.cellMatrix[row].length; col++) {
        if (col !== firstCell.column) continue

        const cell = this.cellMatrix[row][col]
        if (cell.id === firstCell.id) continue

        // The next cell of first ship cell is reserved, so skip it in manual mode.
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

    this.resetShipPreviousCells(shipCells)

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
    const firstCell = shipCells[0] // TODO: Unshift?
    const lastCell = shipCells[shipCells.length - 1]

    // Check that ship can be rotated.
    const newCells: Cell[] = []
    for (let col = firstCell.column; col < firstCell.column + this.ship.size; col++) {
      const cell = this.cellMatrix[firstCell.row][col]

      if (cell.id === firstCell.id) continue

      // The first ship cell is reserved for rotation, so skip it in manual mode.
      if (cell.column === firstCell.column + 1) {
        newCells.push(cell)
        continue
      }

      // TODO: Comment
      if (!cell.isEmpty) {
        return false
      }
      newCells.push(cell)
    }

    // TODO: Cringe
    let prevRow = firstCell.row - 1
    let prevCol = firstCell.column - 1
    if (prevRow < 0) prevRow = 0
    if (prevCol < 0) prevCol = 0

    // Unreserve all reserved cells around the ship.
    const lastRow = Math.min(lastCell.row + 1, this.cellMatrix[lastCell.row].length - 1) + 1

    for (let row = prevRow; row < lastRow; row++) {
      for (let col = prevCol; col <= firstCell.column + 1; col++) {
        const cell = this.cellMatrix[row][col]

        if (!cell.isPlaced) {
          cell.reset()
          cell.unreserve(this.ship.id)
        }
      }
    }

    // TODO: Проверка на диагональ

    this.resetShipPreviousCells(shipCells)
    this.placeShipToNewCells(newCells)
    this.ship.rotate(newCells)

    // Reserve new cells around the ship.
    for (let row = prevRow; row <= firstCell.row + 1; row++) {
      for (
        let col = prevCol;
        col <=
        Math.min(firstCell.column + this.ship.size, this.cellMatrix[firstCell.row].length - 1);
        col++
      ) {
        const cell = this.cellMatrix[row][col]

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
      // TODO: Checkout
      if (!cell.isEmpty) {
        cell.reset()
        cell.unreserve(this.ship.id)
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

      // TODO: Checkout
      cell.reset()
      cell.unreserve(this.ship.id)
    }
  }
}
