import React from 'react'

import daysToPlay from '../daysToPlay'

export default ({ challenge, players }) => {
  const challenger = players.find((d) => d._id === challenge.challenger)
  const challenged = players.find((d) => d._id === challenge.challenged)

  return <div style={{ paddingBottom: '10px' }}>
    <b>{challenger.name}</b> has challenged
    <b> {challenged.name}</b>. They've got
    <b> {daysToPlay(challenge.date)} days</b> to play
  </div>
}
