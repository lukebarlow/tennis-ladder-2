import React from 'react'
import { json } from 'd3-fetch'

// import SinglesLadder from './SinglesLadder'
import Ladder from './Ladder'
import SinglesMatches from './SinglesMatches'

export default class SinglesPanel extends React.Component {
  constructor () {
    super()
    this.addMatchHandler = this.addMatchHandler.bind(this)
    this.state = {
      matches: null,
      players: null
    }
    this._load()
  }

  async _load () {
    try {
      const matches = await json('./recentMatches')
      const players = await json('./ladder')
      this.setState({
        matches,
        players,
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
    await json(`./addMatch?match=${JSON.stringify(match)}`)
    await this._load()
  }

  render () {
    if (this.state.error) {
      return <span style={{ color: 'red' }}>{this.state.error}</span>
    }

    const { userId } = this.props
    return <table width='100%'>
      <tbody>
        <tr>
          <td width='50%'>
            <h1>singles</h1>
            <br />
            <Ladder userId={userId} rungs={this.state.players} />
          </td>
          <td width='50%'>
            <h1>recent matches</h1>
            <SinglesMatches userId={userId} onAddMatch={this.addMatchHandler} {...this.state} />
          </td>
        </tr>
      </tbody>
    </table>
  }
}

// export default ({ userId }) => (
// )
