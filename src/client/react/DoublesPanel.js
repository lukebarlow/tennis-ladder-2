/* eslint-disable react/jsx-handler-names */

import React from 'react'
import { json } from 'd3-fetch'

import DoublesLadder from './DoublesLadder'
import MatchesPanel from './MatchesPanel'

import css from './TwoPartPanel.css'

export default class DoublesPanel extends React.Component {
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
      const matches = await json('/.netlify/functions/doublesMatches')
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
    await json(`.netlify/functions/addDoublesMatch?match=${JSON.stringify(match)}`)
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

    const idsOfAllDoublesPlayers = new Set()
    for (const match of this.state.matches) {
      for (const id of match.sideA) {
        idsOfAllDoublesPlayers.add(id)
      }
      for (const id of match.sideB) {
        idsOfAllDoublesPlayers.add(id)
      }
    }

    const doublesPlayers = players.filter(p => idsOfAllDoublesPlayers.has(p._id))

    return (
      <div className={css.scrollContainer}>
        <div className={css.twoColumns}>
          <div className={css.header1}>doubles ladder</div>
          <div className={css.body1}>
            <DoublesLadder
              userId={userId}
              players={doublesPlayers}
            />
          </div>
          <div className={css.header2}>doubles matches</div>
          <div className={css.body2}>
            <MatchesPanel
              userId={userId}
              players={players}
              playersPerSide={2}
              onAddMatch={this.addMatchHandler}
              {...this.state}
            />
          </div>
        </div>
      </div>
    )
  }
}
