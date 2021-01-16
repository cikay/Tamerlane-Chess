import NoneSlidePiece from './NoneSlidePiece'

export default class Vizier extends NoneSlidePiece {
  constructor(row, col, color) {
    super(row, col, color)
    this.directions = [
      { rowDir: -1, colDir: 0 },
      { rowDir: 0, colDir: 1 },
      { rowDir: 1, colDir: 0 },
      { rowDir: 0, colDir: -1 },
    ]
  }
}