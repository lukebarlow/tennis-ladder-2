import React from 'react'
import {
  Modal
} from 'react-bootstrap'
import 'd3-transition'

import { json } from 'd3-fetch'

import CloseButton from './CloseButton'
import css from './ChallengeModal.css'

export default class LoginModal extends React.Component {
  constructor (props) {
    super()
    this.createChallenge = this.createChallenge.bind(this)
  }

  async createChallenge () {
    const { userId, challenged } = this.props
    const challenge = {
      challenger: userId,
      challenged: challenged
    }
    await json(`./addSinglesChallenge?challenge=${JSON.stringify(challenge)}`)
    this.props.onClose()
  }

  render () {
    const { players, challenged } = this.props

    if (!challenged) {
      return null
    }

    const name = players.find((p) => p._id === challenged).name

    return <Modal show={this.props.show} onHide={this.props.onClose}>
      <Modal.Header >
        <CloseButton onClick={this.props.onClose} />
      </Modal.Header>
      <Modal.Body>
        <div className={css.challengeText}>You are about to challenge {name}.
        This means {name}  must accept this challenge
        within 28 days and play a match, or forfeit his or her position in the ladder.
        You will both be emailed to confirm the challenge, and you can
        reply to this email to talk to {name} and organise the game.
        </div>
        <br />
        <button style={{ float: 'right' }} onClick={this.createChallenge}>confirm</button>
      </Modal.Body>
    </Modal>
  }
}
