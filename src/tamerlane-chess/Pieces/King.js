import NoneSlidePiece from './NoneSlidePiece'

export default class King extends NoneSlidePiece {
  static _directions = [
    { rowDir: 0, colDir: 1 },
    { rowDir: -1, colDir: 1 },
    { rowDir: -1, colDir: 0 },
    { rowDir: -1, colDir: -1 },
    { rowDir: 0, colDir: -1 },
    { rowDir: 1, colDir: -1 },
    { rowDir: 1, colDir: 0 },
    { rowDir: 1, colDir: 1 },
  ]

  constructor(row, col, color) {
    super(row, col, color)
    this.fenChar = 's'
    this.king = true
    this.setFenChar()
  }

  validMoves(board, playerColor) {
    //ozel durumlar kontrol edilecek
    let moves = []
    if (true) {
      moves = super.validMoves(board, playerColor)
    }
    return moves
  }
}
