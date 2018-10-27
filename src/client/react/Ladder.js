import React from 'react'

export default ({ rungs }) => {
  if (!rungs) {
    return null
  } else {
    return <span>
      { rungs.map((rung, i) => (
        <span key={rung.name}>{i + 1}. {rung.name}<br /></span>
      ))}
    </span>
  }
  
}
