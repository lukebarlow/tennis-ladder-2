import React from 'react'
import css from './MatchStats.css'

function winLoseDraw (player, matches) {
  let win = 0
  let lose = 0
  let draw = 0

  for (const m of matches) {
    if (!m.wonBy) {
      draw++
    } else if ((m.wonBy === 'sideA' && m.sideA === player._id) || (m.wonBy === 'sideB' && m.sideB === player._id)) {
      win++
    } else {
      lose++
    }
  }
  return { win, lose, draw }
}

export default function ({ players, selectedPlayers, matches }) {
  const matchNoun = 'match' + (matches.length !== 1 ? 'es' : '')

  if (selectedPlayers.length === 1) {
    const player = selectedPlayers[0]
    const { win, lose, draw } = winLoseDraw(player, matches)
    return (
      <div className={css.stats}>
        {player.name} has played {matches.length} {matchNoun}<br />
        W{win} L{lose} D{draw}
      </div>
    )
  }
  if (selectedPlayers.length === 2) {
    const p1 = selectedPlayers[0]
    const p2 = selectedPlayers[1]
    const { win, lose, draw } = winLoseDraw(p1, matches)
    return (
      <div className={css.stats}>
        {p1.name} v {p2.name}<br />
        {matches.length} {matchNoun}<br />
        {p1.name} {win}, {p2.name} {lose}, with {draw} draws
      </div>
    )
  }
  return null
}
