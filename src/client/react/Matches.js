import React, { useRef, useEffect } from 'react'

import { timeFormat } from 'd3-time-format'
const formatTimeWithoutYear = timeFormat('%a %-e %b')
const formatTimeWithYear = timeFormat('%a %-e %b %Y')

function formatTime (value) {
  if (value.getYear() === new Date().getYear()) {
    return formatTimeWithoutYear(value)
  } else {
    return formatTimeWithYear(value)
  }
}

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

export default ({ matches, players, onTopMatchChange, scrollNotifier }) => {
  function ratingMoveCell (match, side) {
    // only show ratings movements for doubles at the moment
    if (!Array.isArray(match.sideA)) {
      return null
    }
    return (
      <td style={{ borderWidth: 0, fontSize: '60%' }}>
        ({side === match.wonBy ? '+' : '-'} {match.ratingsMoveBy})
      </td>
    )
  }

  const main = useRef(null)
  const matchesRef = useRef({ matches })
  // const matchElements = useRef([])
  const currentTopMatch = useRef(null)

  window.main = main

  matchesRef.current.matches = matches

  useEffect(() => {
    if (!scrollNotifier) {
      return
    }
    scrollNotifier.on('scroll', (scrollTop) => {
      // find the top match in the scroll position
      const matchNodes = Array.from(main.current.childNodes)
      const matches = matchesRef.current.matches
      const top = matchNodes.find(e => (e.offsetTop) > scrollTop)
      const i = matchNodes.indexOf(top)
      let match = matches[i]

      const date = match.date

      match = matches.find(m => m.date === date)
      if (match !== currentTopMatch) {
        currentTopMatch.current = match
        onTopMatchChange(match)
      }
    })
  }, [scrollNotifier])

  return (
    <span ref={main}>
      {matches.map((match, i) => (
        <div
          key={i}
          className='match'
        >
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
                {ratingMoveCell(match, 'sideA')}
              </tr>
              <tr>
                <td style={{ fontWeight: match.wonBy === 'sideB' ? '400' : 'inherit' }}>{getPlayerNames(match.sideB, players)}</td>
                {
                  match.score.map((set, j) => (
                    <td key={j}>{set[1]}</td>
                  ))
                }
                {ratingMoveCell(match, 'sideB')}
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </span>
  )
}
