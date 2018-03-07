import React from 'react'

import { timeFormat } from 'd3-time-format'
const formatTime = timeFormat('%a, %-e %b')

export default ({ matches }) => {
  return <span>
    { matches.map((match, i) => (
      <div key={i} className='match'>
        {formatTime(new Date(match.date))}
        <table>
          <tbody>
            <tr>
              <td>{match.playerA.name}</td>
              {
                match.score.map((set, j) => (
                  <td key={j}>{set[0]}</td>
                ))
              }
            </tr>
            <tr>
              <td>{match.playerB.name}</td>
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
