import NoneSlidePiece from './NoneSlidePiece'

export default class WarEngine extends NoneSlidePiece {
  constructor(row, col, color) {
    super(row, col, color)
    this.directions = [
      { rowDir: -2, colDir: 0 },
      { rowDir: 0, colDir: 2 },
      { rowDir: 2, colDir: 0 },
      { rowDir: 0, colDir: -2 },
    ]
  }
}