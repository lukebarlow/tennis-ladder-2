import React from 'react'
import { json } from 'd3-fetch'

import SinglesLadder from './SinglesLadder'
import MatchesPanel from './MatchesPanel'

import css from './TwoPartPanel.css'

export default class SinglesPanel extends React.Component {
  constructor () {
    super()
    this.addMatchHandler = this.addMatchHandler.bind(this)
    this.addChallengeHandler = this.addChallengeHandler.bind(this)
    this.state = {
      matches: null
    }
    this._load()
  }

  async _load () {
    try {
      const matches = await json('./recentSinglesMatches')
      const challenges = await json('./singlesChallenges')
      this.setState({
        matches,
        challenges,
        error: null
      })
    } catch (e) {
      console.log('error loading data')
      this.setState({
        error: 'Error loading ladder data'
      })
    }
  }

  async addMatchHandler (match) {
    await json(`./addSinglesMatch?match=${JSON.stringify(match)}`)
    this.props.onChange()
    await this._load()
  }

  async addChallengeHandler () {
    this.props.onChange()
    await this._load()
  }

  render () {
    if (this.state.error) {
      return <span style={{ color: 'red' }}>{this.state.error}</span>
    }

    const { userId, players } = this.props

    if (!players) {
      return ''
    }

    const cutoff = this.props.config.daysSincePlayedCutoffSingles

    return <div className={css.scrollContainer}>
      <div className={css.twoColumns}>
        <div className={css.header1}>singles ladder</div>
        <div className={css.body1}>
          <SinglesLadder
            userId={userId}
            players={players}
            cutoff={cutoff}
            challenges={this.state.challenges}
            onAddChallenge={this.addChallengeHandler}
          />
        </div>
        <div className={css.header2}>singles matches</div>
        <div className={css.body2}>
          <MatchesPanel
            userId={userId}
            players={players}
            playersPerSide={1}
            onAddMatch={this.addMatchHandler}
            {...this.state}
          />
        </div>
      </div>
    </div>
  }
}
