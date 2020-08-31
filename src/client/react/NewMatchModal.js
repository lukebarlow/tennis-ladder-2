/* eslint-disable react/jsx-handler-names */

import React from 'react'
import { Modal } from 'react-bootstrap'

import range from '../range'

import CloseButton from './CloseButton'
import PlayerSelect from './PlayerSelect'
import ScoreSelect from './ScoreSelect'

const validSet = ([a, b]) => typeof a === 'number' && typeof b === 'number'

export default class NewMatchModal extends React.Component {
  constructor ({ playersPerSide }) {
    super()
    this.replaceUserId = this.replaceUserId.bind(this)
    this.closeHandler = this.closeHandler.bind(this)
    this.scoreSelectHandler = this.scoreSelectHandler.bind(this)
    this.playerSelectHandler = this.playerSelectHandler.bind(this)
    this.addMatchHandler = this.addMatchHandler.bind(this)
    this.sideASelect = React.createRef()
    this.sideBSelect = React.createRef()

    this.state = this.getInitialState(playersPerSide)
  }

  getInitialState (playersPerSide) {
    return {
      score: [[]],
      sideA: playersPerSide === 1 ? ['USER_ID'] : ['USER_ID', ''],
      sideB: playersPerSide === 1 ? [''] : ['', '']
    }
  }

  replaceUserId (value) {
    return value === 'USER_ID' ? this.props.userId : value
  }

  scoreSelectHandler (player, set) {
    const playerIndex = player === 'a' ? 0 : 1
    return (event) => {
      const score = this.state.score
      let games = parseInt(event.target.value)
      if (isNaN(games)) {
        games = ''
      }
      if (!score[set]) {
        score[set] = []
      }
      score[set][playerIndex] = games

      const enteredSets = score.filter(validSet).length
      if (score.length > enteredSets + 1) {
        score.pop()
      }
      if (score.length < enteredSets + 1) {
        score.push([])
      }
      this.setState({ score })
    }
  }

  playerSelectHandler (side, playerIndex) {
    return (event) => {
      const value = event.target.options[event.target.selectedIndex].value
      const stateUpdate = {}
      stateUpdate[side] = this.state[side]
      stateUpdate[side][playerIndex] = value
      this.setState(stateUpdate)
    }
  }

  async addMatchHandler () {
    const match = {
      sideA: this.state.sideA.map(this.replaceUserId),
      sideB: this.state.sideB.map(this.replaceUserId),
      score: this.state.score.filter(validSet),
      recordedBy: this.props.userId
    }
    await this.props.onAddMatch(match)
    this.props.onClose()
    this.setState(this.getInitialState(this.props.playersPerSide))
  }

  closeHandler () {
    this.setState({
      score: [[]]
    })
    this.props.onClose()
  }

  render () {
    const { players, playersPerSide } = this.props

    return (
      <Modal show={this.props.show} onHide={this.closeHandler}>
        <Modal.Header>
          <CloseButton onClick={this.closeHandler} />
        </Modal.Header>
        <Modal.Body>
          <h1>record a match</h1>
          <br />
          <div className='match'>
            <table>
              <tbody>
                <tr>
                  <td>
                    {
                      range(playersPerSide).map((i) => (
                        <React.Fragment key={i}>
                          {i > 0 && ' '}
                          <PlayerSelect
                            players={players}
                            value={this.replaceUserId(this.state.sideA[i])}
                            onChange={this.playerSelectHandler('sideA', i)}
                          />
                        </React.Fragment>
                      ))
                    }
                  </td>
                  {
                    range(this.state.score.length).map((i) => (
                      <td key={i}>
                        <ScoreSelect
                          value={this.state.score[i] ? this.state.score[i][0] : ''}
                          onChange={this.scoreSelectHandler('a', i)}
                        />
                      </td>
                    ))
                  }
                </tr>
                <tr>
                  <td>
                    {
                      range(playersPerSide).map((i) => (
                        <React.Fragment key={i}>
                          {i > 0 && ' '}
                          <PlayerSelect
                            players={players}
                            value={this.replaceUserId(this.state.sideB[i])}
                            onChange={this.playerSelectHandler('sideB', i)}
                          />
                        </React.Fragment>
                      ))
                    }
                  </td>
                  {
                    range(this.state.score.length).map((i) => (
                      <td key={i}>
                        <ScoreSelect
                          value={this.state.score[i] ? this.state.score[i][1] : ''}
                          onChange={this.scoreSelectHandler('b', i)}
                        />
                      </td>
                    ))
                  }
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <button
            id='addMatch'
            style={{ float: 'right' }}
            onClick={this.addMatchHandler}
          >add match
          </button>
        </Modal.Body>
      </Modal>
    )
  }
}
