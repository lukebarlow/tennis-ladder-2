import React from 'react'
import CloseButton from './CloseButton'
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

function dateFilter(date) {
  return (match) => {
    if (!date) {
      return true
    }
    return match.date <= date
  }
}

export default function ({ selectedPlayers, matches, asOfDate, onClose }) {
  const matchNoun = 'match' + (matches.length !== 1 ? 'es' : '')

  if (selectedPlayers.length === 1) {
    const player = selectedPlayers[0]
    const relevantMatches = matches
      .filter(m => m.sideA === player._id || m.sideB === player._id)
      .filter(dateFilter(asOfDate))
    const { win, lose, draw } = winLoseDraw(player, relevantMatches)
    return (
      <div className={css.stats}>
        <div>
          <span style={{fontWeight: 400}}>{player.name}</span>
          <span className={css.closeButton}><CloseButton size={15} onClick={() => {
            onClose()
          }} /></span>
        </div> {asOfDate ? 'had' : 'has'} played {relevantMatches.length} {matchNoun}<br />
        {win} wins, {lose} losses and {draw} draws.
      </div>
    )
  }

  if (selectedPlayers.length === 2) {
    const p1 = selectedPlayers[0]
    const p2 = selectedPlayers[1]
    const ids = [p1._id, p2._id]
    const relevantMatches = matches
      .filter(m => ids.includes(m.sideA) && ids.includes(m.sideB))
      .filter(dateFilter(asOfDate))
    const { win, lose, draw } = winLoseDraw(p1, relevantMatches)
    return (
      <div className={css.stats}>
        <div>
          <span style={{fontWeight: 400}}>{p1.name} v {p2.name}</span>
          <span className={css.closeButton}><CloseButton size={15} onClick={() => {
            onClose()
          }} /></span>
        </div>
        {relevantMatches.length} {matchNoun}<br />
        {p1.name} {win}, {p2.name} {lose}, with {draw} draws
      </div>
    )
  }
  return null
}
