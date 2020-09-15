/* eslint-disable react/jsx-handler-names */

import React from 'react'
import { json } from 'd3-fetch'
import { addEvents } from 'properties-and-events'
import { timeFormat } from 'd3-time-format'

import SinglesLadder from './SinglesLadder'
import MatchesPanel from './MatchesPanel'

import css from './TwoPartPanel.css'

const formatTimeWithYear = timeFormat('%a %-e %b %Y')

class ScrollNotifier {
  constructor () {
    addEvents(this, 'scroll')
  }
}

export default class SinglesPanel extends React.Component {
  constructor () {
    super()
    this.addMatchHandler = this.addMatchHandler.bind(this)
    this.addChallengeHandler = this.addChallengeHandler.bind(this)
    this.playerClickHandler = this.playerClickHandler.bind(this)
    this.topMatchHandler = this.topMatchHandler.bind(this)
    this.state = {
      matches: null,
      selectedPlayers: [],
      ladder: null
    }
    this._load()
    this._timeoutId = null
    this._scrollNotifier = new ScrollNotifier()
  }

  async _load () {
    try {
      // const challenges = await json('./singlesChallenges')
      const matches = await json('./singlesMatches')
      this.setState({
        matches,
        // challenges,
        ladder: matches[0]?.ladderAfterMatch,
        error: null
      })
      window.players = this.props.players
      window.matches = matches
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

  async playerClickHandler (player) {
    let { selectedPlayers } = this.state
    if (selectedPlayers.includes(player)) {
      selectedPlayers = selectedPlayers.filter(p => p !== player)
    } else {
      selectedPlayers = [...selectedPlayers.slice(0, 1), player]
    }

    this.setState({ selectedPlayers })
  }

  topMatchHandler (topMatch) {
    if (!topMatch) {
      return
    }
    if (topMatch !== this.state.topMatch) {
      if (this._timeoutId) {
        window.clearTimeout(this._timeoutId)
      }
      this._timeoutId = window.setTimeout(() => {
        this.setState({ topMatch })
        this._timeoutId = null
      }, 1)
    }
  }

  render () {
    if (this.state.error) {
      return <span style={{ color: 'red' }}>{this.state.error}</span>
    }

    const { userId, players } = this.props
    const { topMatch, challenges, selectedPlayers, matches } = this.state

    if (!players) {
      return ''
    }

    const cutoff = this.props.config.daysSincePlayedCutoffSingles
    return (
      <div className={css.scrollContainer}>
        <div className={css.twoColumns}>
          <div className={css.header1}>singles ladder</div>
          <div className={css.body1}>
            {
              matches && topMatch && topMatch !== matches[0] && (
                <div style={{ paddingTop: 0, paddingBottom: 10 }}>(as of {formatTimeWithYear(new Date(topMatch.date))})</div>
              )
            }
            <SinglesLadder
              ladder={(topMatch || matches?.[0])?.ladderAfterMatch}
              userId={userId}
              players={players}
              cutoff={cutoff}
              challenges={challenges}
              onAddChallenge={this.addChallengeHandler}
              onPlayerClick={this.playerClickHandler}
              selectedPlayers={selectedPlayers}
            />
          </div>
          <div className={css.header2}>singles matches</div>
          <div
            className={css.body2}
            onScroll={(e) => {
              this._scrollNotifier.fire('scroll', e.nativeEvent.srcElement.scrollTop)
            }}
          >
            <MatchesPanel
              userId={userId}
              players={players}
              playersPerSide={1}
              onAddMatch={this.addMatchHandler}
              onTopMatchChange={this.topMatchHandler}
              scrollNotifier={this._scrollNotifier}
              {...this.state}
            />
          </div>
        </div>
      </div>
    )
  }
}
