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
  return <span>
    { matches.map((match, i) => (
      <div key={i} className='match'>
        {formatTime(new Date(match.date))}
        <table>
          <tbody>
            <tr>
              <td>{getPlayerNames(match.sideA, players)}</td>
              {
                match.score.map((set, j) => (
                  <td key={j}>{set[0]}</td>
                ))
              }
            </tr>
            <tr>
              <td>{getPlayerNames(match.sideB, players)}</td>
              {
                match.score.map((set, j) => (
                  <td key={j}>{set[1]}</td>
                ))
              }
            </tr>
          </tbody>
        </table>
      </div>
    ))}
  </span>
}
