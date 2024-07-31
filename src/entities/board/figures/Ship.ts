import { Cell } from '@/entities/board/Cell.ts'

export const enum ShipOrientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}

export const enum ShipType {
  CARRIER = 'carrier',
  BATTLESHIP = 'battleship',
  CRUISER = 'cruiser',
  DESTROYER = 'destroyer',
  BOAT = 'boat'
}

export abstract class Ship {
  private hits: number

  public readonly id: string
  public readonly size: number
  public readonly type: ShipType

  public orientation: ShipOrientation
  public isPlaced: boolean
  public cells: Cell[]
  public isDestroyed: boolean

  protected constructor(size: number, orientation: ShipOrientation, type: ShipType) {
    this.hits = 0
    this.isDestroyed = false

    this.id = Math.random().toString()
    this.size = size
    this.type = type
    this.orientation = orientation
    this.isPlaced = false
    this.cells = []
  }

  public rotate(): void {
    if (this.orientation === ShipOrientation.HORIZONTAL) {
      this.orientation = ShipOrientation.VERTICAL
    } else {
      this.orientation = ShipOrientation.HORIZONTAL
    }

    // TODO: Checkout
    this.cells.length = 1
  }

  public place(cells: Cell[]): void {
    this.isPlaced = true
    this.cells.push(...cells)

    for (const cell of cells) {
      cell.placeShip()
    }

    this.cells[0].addDependentShip(this)
  }

  public unplace(): void {
    this.isPlaced = false

    for (const cell of this.cells) {
      cell.reset()
    }

    this.cells = []
  }

  public hit(cell: Cell): boolean {
    cell.hit()
    this.hits++

    if (this.hits === this.size) {
      this.destroy()

      return true
    }

    return false
  }

  private destroy(): void {
    this.isDestroyed = true
  }
}
