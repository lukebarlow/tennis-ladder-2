import React from 'react'

import { timeFormat } from 'd3-time-format'
const formatTime = timeFormat('%a %-e %b')

function getPlayerName (id, players) {
  const f = players.find(p => p._id === id)
  return f ? f.name : '[player not found]'
}

function getPlayerNames (ids, players) {
  if (!Array.isArray(ids)) {
    ids = [ids]
  }
  const names = ids.map((id) => getPlayerName(id, players))
  return names.join(', ')
}

export default ({ matches, players }) => {

  function ratingMoveCell (match, side) {
    // only show ratings movements for doubles at the moment
    if (!Array.isArray(match.sideA)) {
      return null
    }
    return <td style={{ borderWidth: 0, fontSize: '60%' }}>
      ({side === match.wonBy ? '+' : '-'} {match.ratingsMoveBy})
    </td>
  }

  return <span>
    { matches.map((match, i) => (
      <div key={i} className='match'>
        {formatTime(new Date(match.date))}
        <table>
          <tbody>
            <tr>
              <td style={{ fontWeight: match.wonBy === 'sideA' ? '400' : 'inherit' }}>{getPlayerNames(match.sideA, players)}</td>
              {
                match.score.map((set, j) => (
                  <td key={j}>{set[0]}</td>
                ))
              }
              { ratingMoveCell(match, 'sideA') }
            </tr>
            <tr>
              <td style={{ fontWeight: match.wonBy === 'sideB' ? '400' : 'inherit' }}>{getPlayerNames(match.sideB, players)}</td>
              {
                match.score.map((set, j) => (
                  <td key={j}>{set[1]}</td>
                ))
              }
              { ratingMoveCell(match, 'sideB') }
            </tr>
          </tbody>
        </table>
      </div>
    ))}
  </span>
}
