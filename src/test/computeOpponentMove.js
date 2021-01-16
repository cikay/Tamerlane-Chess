function computeOpponentMove(from, to) {
  from.row = 10 - from.row - 1
  from.col = 13 - from.col - 1
  to.row = 10 - to.row - 1
  to.col = 13 - to.col - 1
  return { from, to }
}

const move = computeOpponentMove({ row: 2, col: 1 }, { row: 3, col: 1 })
console.log(move)
