import React from 'react'
import fetchJson from '../fetchJson'
import Matches from './Matches'

export default class SinglesMatches extends React.Component {
  constructor () {
    super()
    this.state = {
      loading: true,
      matches: []
    }
    this._load()
  }

  async _load () {
    const matches = await fetchJson('./recentMatches')
    this.setState({
      loading: false,
      matches: matches
    })
  }

  render () {
    if (this.state.loading) {
      return 'loading...'
    } else {
      return <span>
        <a className='button'>record a match</a><br />
        <br />
        <Matches matches={this.state.matches} />
      </span>
    }
  }
}
