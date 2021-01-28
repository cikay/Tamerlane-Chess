import NoneSlidePiece from './NoneSlidePiece'

export default class General extends NoneSlidePiece {
  static _directions = [
    { rowDir: -1, colDir: 1 },
    { rowDir: 1, colDir: 1 },
    { rowDir: 1, colDir: -1 },
    { rowDir: -1, colDir: -1 },
  ]
  static fenChar = 'g'
}
