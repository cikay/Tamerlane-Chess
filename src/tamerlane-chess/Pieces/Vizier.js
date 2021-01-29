import NoneSlidePiece from './NoneSlidePiece'

export default class Vizier extends NoneSlidePiece {
  static _directions = [
    { rowDir: -1, colDir: 0 },
    { rowDir: 0, colDir: 1 },
    { rowDir: 1, colDir: 0 },
    { rowDir: 0, colDir: -1 },
  ]
 
  constructor(row, col, color) {
    super(row, col, color)
    this.fenChar = "v"
    this.setFenChar()
  }
}
