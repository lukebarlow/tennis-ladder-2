import React from 'react'
import Ladder from './Ladder'

async function fetchJson (url) {
  const response = await fetch(url)
  return await response.json()
}

export default class SinglesLadder extends React.Component {
  constructor () {
    super()
    this.state = {
      loading: true,
      rungs: []
    }
    this._load()
  }

  async _load () {
    const rungs = await fetchJson('./ladder')
    this.setState({
      loading: false,
      rungs: rungs
    })
  }

  render () {
    if (this.state.loading) {
      return 'loading...'
    } else {
      return <Ladder rungs={this.state.rungs} />
    }
  }
}
