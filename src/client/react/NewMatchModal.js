import React from 'react'
import { Modal } from 'react-bootstrap'

import range from '../range'

import CloseButton from './CloseButton'
import PlayerSelect from './PlayerSelect'
import ScoreSelect from './ScoreSelect'

const validSet = ([a, b]) => a !== undefined && b !== undefined

export default class NewMatchModal extends React.Component {
  constructor ({ userId, players, playersPerSide }) {
    super()
    this.closeHandler = this.closeHandler.bind(this)
    this.scoreSelectHandler = this.scoreSelectHandler.bind(this)
    this.playerSelectHandler = this.playerSelectHandler.bind(this)
    this.addMatchHandler = this.addMatchHandler.bind(this)
    this.sideASelect = React.createRef()
    this.sideBSelect = React.createRef()

    if (playersPerSide === 1) {
      this.state = {
        score: [[]],
        sideA: [userId],
        sideB: ['']
      }
    } else {
      this.state = {
        score: [[]],
        sideA: [userId, ''],
        sideB: ['', '']
      }
    }
  }

  scoreSelectHandler (player, set) {
    const playerIndex = player === 'a' ? 0 : 1
    return (event) => {
      const score = this.state.score
      const games = parseInt(event.target.value)
      if (!score[set]) {
        score[set] = []
      }
      score[set][playerIndex] = games

      let enteredSets = score.filter(validSet).length
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
      sideA: this.state.sideA,
      sideB: this.state.sideB,
      score: this.state.score.filter(validSet),
      recordedBy: this.props.userId
    }
    await this.props.onAddMatch(match)
    this.props.onClose()
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
        <Modal.Header >
          <CloseButton onClick={this.closeHandler} />
        </Modal.Header>
        <Modal.Body>
          <h1>record a match</h1>
          <br />
          <div className='match' >
            <table>
              <tbody>
                <tr>
                  <td>
                    {
                      range(playersPerSide).map((i) => (
                        <React.Fragment key={i}>
                          { i > 0 && ' ' }
                          <PlayerSelect
                            players={players}
                            value={this.state.sideA[i]}
                            onChange={this.playerSelectHandler('sideA', i)}
                          />
                        </React.Fragment>
                      ))
                    }
                  </td>
                  {
                    range(this.state.score.length).map((i) => (
                      <td key={i} >
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
                          { i > 0 && ' ' }
                          <PlayerSelect
                            players={players}
                            value={this.state.sideB[i]}
                            onChange={this.playerSelectHandler('sideB', i)}
                          />
                        </React.Fragment>
                      ))
                    }
                  </td>
                  {
                    range(this.state.score.length).map((i) => (
                      <td key={i} >
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
            onClick={this.addMatchHandler}>add match</button>
        </Modal.Body>
      </Modal>
    )
  }
}
