import React from 'react'

import css from './Ladder.css'

export default ({ rungs, extraFields = [] }) => {
  if (!rungs) {
    return null
  } else {
    return <span>
      { rungs.map((rung, i) => {
        const fields = extraFields.map((f) => <span className={css.extra} key={f}>({rung[f]}</span>)
        return <span key={rung.name}>{i + 1}. {rung.name} {fields}<br /></span>
      })}
    </span>
  }
}
