import React from 'react'
import {
  Button,
  Modal
} from 'react-bootstrap'

export default class LoginModal extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header >
          <Button onClick={this.props.onClose}>Close</Button>
        </Modal.Header>
        <Modal.Body>
          <h1>record a match</h1>
          please enter the match details
          <br />
          <br />
          <div style={{ float: 'left'}}>
            <select id='playerA' /><br />
            <select id='playerB' />
          </div>
          <div id='score' />
          <br />
          <br />
          <br />
          <button id='addMatch' style={{float: 'right'}}>add match</button>
        </Modal.Body>
      </Modal>
    )
  }
}
