import React from 'react'

export default function ({ players, onChange, value }) {
  return <select onChange={onChange} value={value}>
    { players.map((player) => <option key={player._id} value={player._id}>{player.name}</option>)}
  </select>
}