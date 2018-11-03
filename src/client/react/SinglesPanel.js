import React from 'react'
import { json } from 'd3-fetch'

import Ladder from './Ladder'
import MatchesPanel from './MatchesPanel'

import css from './TwoPartPanel.css'

export default class SinglesPanel extends React.Component {
  constructor () {
    super()
    this.addMatchHandler = this.addMatchHandler.bind(this)
    this.state = {
      matches: null
    }
    this._load()
  }

  async _load () {
    try {
      const matches = await json('./recentSinglesMatches')
      this.setState({
        matches,
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

    return <div className={css.twoColumns}>
      <div className={css.header1}>singles</div>
      <div className={css.body1}>
        <Ladder userId={userId} rungs={this.props.players} />
      </div>
      <div className={css.header2}>recent matches</div>
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
  }
}
