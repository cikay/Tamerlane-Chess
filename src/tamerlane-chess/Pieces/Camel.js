import NoneSlidePiece from './NoneSlidePiece'

export default class Camel extends NoneSlidePiece {
  static _directions = [
    { rowDir: -3, colDir: 1 },
    { rowDir: -3, colDir: -1 },
    { rowDir: -1, colDir: 3 },
    { rowDir: -1, colDir: -3 },
    { rowDir: 1, colDir: 3 },
    { rowDir: 1, colDir: -3 },
    { rowDir: 3, colDir: 1 },
    { rowDir: 3, colDir: -1 },
  ]
 
  constructor(rowDir, col, color) {
    super(rowDir, col, color)
    this.fenChar = 'd'
    this.setFenChar()
  }
}
