function idIndexOf (list, id) {
  return list.map(i => i.toString()).indexOf(id.toString())
}

module.exports = (match, winner, loser, previousMatches, luke) => {
  // keep track of when each player last played
  const playedSinceCutoff = new Set()
  for (const m of previousMatches) {
    playedSinceCutoff.add(m.sideA.toString())
    playedSinceCutoff.add(m.sideB.toString())
  }
  playedSinceCutoff.add(match.sideA.toString())
  playedSinceCutoff.add(match.sideA.toString())

  // start with ladder from previous match, then filter and mutate
  let ladder = previousMatches.length ? previousMatches.slice(-1)[0].ladderAfterMatch : []
  ladder = ladder.filter(p => playedSinceCutoff.has(p.toString()))

  if (winner && loser) {
    // const ladderAsStrings = ladder.map(rung => rung.toString())
    const i = idIndexOf(ladder, winner)
    const j = idIndexOf(ladder, loser)
    // if neither player is already in the ladder, they enter as
    // spots 1 and 2
    if (i === -1 && j === -1) {
      ladder.push(winner)
      ladder.push(loser)
      // if just loser is entering, they go one spot below winner
    } else if (j === -1) {
      ladder.splice(i + 1, 0, loser)
      // if just the winner is entering, they go one spot above the winner
    } else if (i === -1) {
      ladder.splice(j, 0, winner)
    } else if (i > j) { // both players are in, but winner was lower down
      ladder.splice(i, 1)
      ladder.splice(j, 0, winner)
    }
  } else {
    // if new players enter on a draw, then
    // add them one spot above Luke, if he's in the ladder,
    // otherwise just add on the bottom

    const i = idIndexOf(ladder, match.sideA)
    const j = idIndexOf(ladder, match.sideB)

    if (luke) {
      const l = idIndexOf(ladder, luke._id)
      if (i === -1) {
        ladder.splice(l, 0, match.sideA)
      }
      if (j === -1) {
        ladder.splice(l, 0, match.sideB)
      }
    } else {
      ladder.push(match.sideA)
      ladder.push(match.sideB)
    }
  }
  return ladder
}
