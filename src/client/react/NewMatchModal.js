import React from 'react'
import { Modal } from 'react-bootstrap'

import { json } from 'd3-fetch'

import range from '../range'

import CloseButton from './CloseButton'
import PlayerSelect from './PlayerSelect'
import ScoreSelect from './ScoreSelect'

export default class NewMatchModal extends React.Component {
  constructor ( { userId, players }) {
    super()
    this.closeHandler = this.closeHandler.bind(this)
    this.scoreSelectHandler = this.scoreSelectHandler.bind(this)
    this.playerSelectHandler = this.playerSelectHandler.bind(this)
    this.addMatchHandler = this.addMatchHandler.bind(this)
    this.playerASelect = React.createRef()
    this.playerBSelect = React.createRef()
    this.state = {
      score: [],
      playerA: userId,
      playerB: players.filter((p) => p !== userId)[0]._id
    }
  }

  scoreSelectHandler (player, set) {
    const playerIndex = player === 'a' ? 0 : 1
    return (event) => {
      const score = this.state.score
      const games = event.target.options[event.target.selectedIndex].value
      if (!this.score[set]) {
        this.score.set = []
      }
      this.score[set][playerIndex] = games
      // even though we are mutating the score, we call setState to
      // trigger the re-render

      console.log('score', score)

      this.setState({ score })
    }
  }

  playerSelectHandler (player) {
    return (event) => {
      const value = event.target.options[event.target.selectedIndex].value
      const stateUpdate = {}
      stateUpdate[player] = value
      this.setState(stateUpdate)
    }
  }

  async addMatchHandler () {
    const match = {
      playerA: this.state.playerA._id,
      playerB: this.state.playerB._id,
      score: this.score,
      recordedBy: this.props.userId
    }
    await this.props.onAddMatch(match)
    this.props.onClose()
  }

  closeHandler () {
    this.score = {
      a: [],
      b: []
    }
    this.props.onClose()
  }

  render () {
    const { players, userId } = this.props
    return (
      <Modal show={this.props.show} onHide={this.closeHandler}>
        <Modal.Header >
          <CloseButton onClick={this.closeHandler} />
        </Modal.Header>
        <Modal.Body>
          <h1>record a match</h1>
          <br />
          <div className="match" >
            <table>
              <tbody>
                <tr>
                  <td>
                    <PlayerSelect
                      players={players}
                      value={this.state.playerA}
                      onChange={this.playerSelectHandler('playerA')} 
                    />
                  </td>
                  {
                    range(this.state.sets).map((i) => (
                      <td key={i} >
                        <ScoreSelect onChange={this.scoreSelectHandler('a', i)} />
                      </td>
                      )
                    )
                  }
                </tr>
                <tr>
                  <td>
                    <PlayerSelect
                      players={players}
                      value={this.state.playerB}
                      onChange={this.playerSelectHandler('playerB')}
                    />
                  </td>
                  {
                    range(this.state.sets).map((i) => (
                      <td key={i} >
                        <ScoreSelect onChange={this.scoreSelectHandler('b', i)} />
                      </td>
                      )
                    )
                  }
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <button id='addMatch' style={{float: 'right'}} onClick={this.addMatchHandler}>add match</button>
        </Modal.Body>
      </Modal>
    )
  }
}
