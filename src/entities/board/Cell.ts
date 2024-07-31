import type { Ship } from './figures/Ship'

export const enum CellState {
  PLACED = 'placed',
  HIT = 'hit',
  MISS = 'miss',
  RESERVED = 'reserved'
}

export class Cell {
  private state: CellState | null

  public readonly column: number
  public readonly row: number

  public isEmpty: boolean
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
    return this.state === CellState.RESERVED
  }

  constructor(column: number, row: number) {
    this.column = column
    this.row = row
    this.state = null
    this.isEmpty = true
    this.dependentShip = null
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

  public reserve(): void {
    this.isEmpty = false
    this.state = CellState.RESERVED
  }

  public addDependentShip(ship: Ship): void {
    this.dependentShip = ship
  }

  private removeDependentShip(): void {
    this.dependentShip = null
  }
}
