import NoneSlidePiece from './NoneSlidePiece'

export default class Knight extends NoneSlidePiece {
  static _directions = [
    { rowDir: -2, colDir: 1 },
    { rowDir: -1, colDir: 2 },
    { rowDir: 1, colDir: 2 },
    { rowDir: 2, colDir: 1 },
    { rowDir: 2, colDir: -1 },
    { rowDir: 1, colDir: -2 },
    { rowDir: -1, colDir: -2 },
    { rowDir: -2, colDir: -1 },
  ]

  constructor(row, col, color) {
    super(row, col, color)
    this.fenChar = 'a'
    this.setFenChar()
  }
}
