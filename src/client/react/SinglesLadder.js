import React from 'react'

import ChallengeModal from './ChallengeModal'
import daysToPlay from '../daysToPlay'
import css from './Ladder.css'

export default class SettingsLadder extends React.Component {
  constructor () {
    super()
    this.closeChallengeModal = this.closeChallengeModal.bind(this)
    this.openChallengeModal = this.openChallengeModal.bind(this)
    this.state = {
      isShowingModal: false,
      challengedUserId: null
    }
  }

  openChallengeModal (userId) {
    this.setState({
      challengedUserId: userId,
      isShowingModal: true
    })
  }

  closeChallengeModal () {
    this.setState({ isShowingModal: false })
    this.props.onAddChallenge()
  }

  render () {
    const { players, challenges, userId, cutoff } = this.props

    const rungs = Array.from(players)
      .filter((r) => (
        r.daysSincePlayedSingles < cutoff
      ))
      .sort((a, b) => a.ladderPosition - b.ladderPosition)

    const opacity = (rung) => (
      rung.daysSincePlayedSingles > (cutoff / 2) ? 0.3 : 1
    )

    const getChallengeDays = (player) => {
      const challenge = challenges.find((c) => (
        (c.challenger === player._id && c.challenged === userId) ||
        (c.challenged === player._id && c.challenger === userId)
      ))
      return challenge ? daysToPlay(challenge.date) : false
    }

    const user = rungs.find((r) => r._id === userId)
    const userPosition = rungs.indexOf(user)
    if (!rungs) {
      return null
    } else {
      return <span>
        { rungs.map((rung, i) => {
          const style = {
            opacity: opacity(rung),
            fontWeight: rung === user ? '400' : 'inherit'
          }
          const challengeDays = getChallengeDays(rung)
          return <span key={rung.name}>
            <span style={style}>{i + 1}. {rung.name}</span>
            { challengeDays === false && user && i < userPosition && i > (userPosition - 4) &&
              <button
                className={css.challenge}
                onClick={() => this.openChallengeModal(rung._id)}
              >challenge</button>
            }
            {
              challengeDays !== false &&
              <span className={css.extra}>{challengeDays} days to play</span>
            }
            <br />
          </span>
        })}
        <ChallengeModal
          players={rungs}
          userId={userId}
          challenged={this.state.challengedUserId}
          show={this.state.isShowingModal}
          onClose={this.closeChallengeModal}
        />
      </span>
    }
  }
}