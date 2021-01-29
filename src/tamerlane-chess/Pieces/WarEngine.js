import NoneSlidePiece from './NoneSlidePiece'

export default class WarEngine extends NoneSlidePiece {
  static _directions = [
    { rowDir: 2, colDir: 0 },
    { rowDir: 0, colDir: 2 },
    { rowDir: -2, colDir: 0 },
    { rowDir: 0, colDir: -2 },
  ]

  constructor(row, col, color) {
    super(row, col, color)
    this.fenChar = 'i'
    this.setFenChar()
  }
}
