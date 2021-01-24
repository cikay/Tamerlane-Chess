export function includeInTwoDimensArray(twoDimensionArray, searchigArray) {
  searchigArray = JSON.stringify(searchigArray)
  for (const array of twoDimensionArray) {
    if (JSON.stringify(array) === searchigArray) {
      return true
    }
  }
  return false
}

export const positionChecker = () => ({
  IsPositionInBoard(row, col) {
    return row < 10 && row >= 0 && col < 11 && col >= 0
  },
})
