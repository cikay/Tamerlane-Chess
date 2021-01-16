import NoneSlidePiece from './NoneSlidePiece'

export default class General extends NoneSlidePiece {
  constructor(row, col, color) {
    super(row, col, color)
    this.directions = [
      { rowDir: -1, colDir: 1 },
      { rowDir: 1, colDir: 1 },
      { rowDir: 1, colDir: -1 },
      { rowDir: -1, colDir: -1 },
    ]
  }
}