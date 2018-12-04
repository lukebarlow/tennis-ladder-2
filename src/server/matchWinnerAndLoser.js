// calculates winner and loser for a match
module.exports = function (match) {
  const aWins = match.score.filter(([a, b]) => a >= 6 && a > b).length
  const bWins = match.score.filter(([a, b]) => b >= 6 && b > a).length
  if (aWins === bWins) {
    return { winner: null, loser: null }
  }
  return aWins > bWins
    ? { winner: match.sideA, loser: match.sideB, wonBy: 'sideA' }
    : { winner: match.sideB, loser: match.sideA, wonBy: 'sideB' }
}
