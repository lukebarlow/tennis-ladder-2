import React from 'react'

export default ({ rungs }) => {
  return <center>
    { rungs.map((rung) => (
      <div key={rung.name}>{rung.ladderPosition} {rung.name}</div>
    ))}
  </center>
}