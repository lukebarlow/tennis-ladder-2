/* eslint-disable react/jsx-handler-names */

import React from 'react'
import Matches from './Matches'
import NewMatchModal from './NewMatchModal'

export default class SinglesMatches extends React.Component {
  constructor () {
    super()
    this.showNewMatchModal = this.showNewMatchModal.bind(this)
    this.closeNewMatchModal = this.closeNewMatchModal.bind(this)
    this.state = {
      showNewMatchModal: false
    }
  }

  showNewMatchModal () {
    this.setState({ showNewMatchModal: true })
  }

  closeNewMatchModal () {
    this.setState({ showNewMatchModal: false })
  }

  render () {
    const {
      players,
      userId,
      playersPerSide,
      onAddMatch,
      selectedPlayers,
      onTopMatchChange,
      scrollNotifier
    } = this.props
    let { matches } = this.props

    if (selectedPlayers?.length) {
      const ids = selectedPlayers.map(p => p._id)
      for (let match of matches) {
        match.defocussed = !ids.every(id => (
          id === match.sideA || id === match.sideB
        ))
      }
    } else {
      for (let match of matches) {
        match.defocussed = false
      }
    }

    if (!matches) {
      return 'loading...'
    } else {
      return (
        <div style={{ marginLeft: 10 }}>
          {
            userId && (
              <>
                <button onClick={this.showNewMatchModal}>record a match</button>
                <br />
              </>
            )
          }
          <Matches
            matches={matches}
            players={players}
            onTopMatchChange={onTopMatchChange}
            scrollNotifier={scrollNotifier}
          />
          <NewMatchModal
            userId={userId}
            players={players}
            playersPerSide={playersPerSide}
            show={this.state.showNewMatchModal}
            onClose={this.closeNewMatchModal}
            onAddMatch={onAddMatch}
          />
        </div>
      )
    }
  }
}
