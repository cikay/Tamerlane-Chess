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
  get directions() {
    return King._directions
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
