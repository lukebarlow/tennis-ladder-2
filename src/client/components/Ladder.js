import React from 'react'

export default ({ rungs }) => {
  return <span>
    { rungs.map((rung, i) => (
      <span key={rung.name}>{i + 1}. {rung.name}<br /></span>
    ))}
  </span>
}
