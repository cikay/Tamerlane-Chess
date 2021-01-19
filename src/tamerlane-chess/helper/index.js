export function includeInTwoDimensArray(twoDimensionArray, searchigArray) {
  searchigArray = JSON.stringify(searchigArray)
  for (const array of twoDimensionArray) {
    if (JSON.stringify(array) === searchigArray) {
      return true
    }
  }
  return false
}
