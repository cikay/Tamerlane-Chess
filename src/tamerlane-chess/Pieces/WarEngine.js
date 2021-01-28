import NoneSlidePiece from './NoneSlidePiece'

export default class WarEngine extends NoneSlidePiece {
  static _directions = [
    { rowDir: 2, colDir: 0 },
    { rowDir: 0, colDir: 2 },
    { rowDir: -2, colDir: 0 },
    { rowDir: 0, colDir: -2 },
  ]
  static fenChar = 'i'
}
