import React from 'react'
import { json } from 'd3-fetch'
import Matches from './Matches'
import NewMatchModeal from './NewMatchModal'

export default class SinglesMatches extends React.Component {
  constructor () {
    super()
    this.showNewMatchModal = this.showNewMatchModal.bind(this)
    this.closeNewMatchModal = this.closeNewMatchModal.bind(this)
    this.state = {
      loading: true,
      showNewMatchModal: false,
      matches: []
    }
    this._load()
  }

  showNewMatchModal () {
    this.setState({ showNewMatchModal: true })
  }

  closeNewMatchModal () {
    this.setState({ showNewMatchModal: false })
  }

  async _load () {
    const matches = await json('./recentMatches')
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
        { this.props.userId && <React.Fragment>
            <a className='button' onClick={this.showNewMatchModal}>record a match</a>
            <br/>
          </React.Fragment>
        }
        <br />
        <Matches matches={this.state.matches} />
        <NewMatchModeal show={this.state.showNewMatchModal} onClose={this.closeNewMatchModal} />
      </span>
    }
  }
}
