import React from 'react'

import css from './Ladder.css'

export default ({ players, userId, cutoff }) => {
  const rungs = Array.from(players)
    // .filter((player) => (
    //   player.daysSincePlayedDoubles
    // ))
    .sort((a, b) => (b.doublesRating || 1200) - (a.doublesRating || 1200))

  const opacity = (rung) => 1

  if (!rungs) {
    return null
  } else {
    return (
      <span>
        {rungs.map((rung, i) => {
          const style = {
            opacity: opacity(rung),
            fontWeight: rung._id === userId ? '400' : 'inherit'
          }
          return (
            <span key={rung.name} style={style}>
              {i + 1}. {rung.name}
              <span className={css.extra}>( {rung.doublesRating} )</span><br />
            </span>
          )
        })}
      </span>
    )
  }
}
