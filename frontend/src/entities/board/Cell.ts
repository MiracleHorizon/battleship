import type { Ship } from './figures/Ship'

export const enum CellState {
  PLACED = 'placed',
  HIT = 'hit',
  MISS = 'miss'
}

export class Cell {
  /**
   * This field is necessary for convenient tracking of reserved cells.
   * When the ship turns or moves, the cells it has reserved around itself must be cleared.
   * However, it is not the only one that can reserve them.
   */
  private readonly reservedBy: Set<string>
  private state: CellState | null

  public readonly column: number
  public readonly row: number

  public isEmpty: boolean
  /**
   *  This field is required to render the ship component in its first cell on the board.
   */
  public dependentShip: Ship | null

  public get id(): string {
    return this.column + this.row.toString()
  }

  public get isPlaced(): boolean {
    return this.state === CellState.PLACED
  }

  public get isHit(): boolean {
    return this.state === CellState.HIT
  }

  public get isMiss(): boolean {
    return this.state === CellState.MISS
  }

  public get isReserved(): boolean {
    return this.reservedBy.size > 0
  }

  constructor(column: number, row: number) {
    this.column = column
    this.row = row
    this.state = null
    this.isEmpty = true
    this.dependentShip = null
    this.reservedBy = new Set()
  }

  public reset(): void {
    this.isEmpty = true
    this.state = null

    if (this.dependentShip) {
      this.removeDependentShip()
    }
  }

  public placeShip(): void {
    this.isEmpty = false
    this.state = CellState.PLACED
  }

  public hit(): void {
    this.isEmpty = false
    this.state = CellState.HIT
  }

  public miss(): void {
    this.isEmpty = false
    this.state = CellState.MISS
  }

  public reserve(shipId: string): void {
    // TODO: Checkout isEmpty
    this.isEmpty = false
    this.reservedBy.add(shipId)
  }

  public unreserve(shipId: string): boolean {
    this.reservedBy.delete(shipId)

    return this.isReserved
  }

  public addDependentShip(ship: Ship): void {
    this.dependentShip = ship
  }

  private removeDependentShip(): void {
    this.dependentShip = null
  }
}
