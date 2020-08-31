import React from 'react'
import Challenge from './Challenge'

export default ({ challenges, players }) => {
  if (!challenges) {
    return 'loading...'
  } else {
    return (
      <span>
        {challenges.map((challenge) => <Challenge players={players} key={challenge._id} challenge={challenge} />)}
      </span>
    )
  }
}
