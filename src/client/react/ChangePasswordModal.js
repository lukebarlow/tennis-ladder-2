/* eslint-disable react/jsx-handler-names */

import React from 'react'
import {
  Modal
} from 'react-bootstrap'
import 'd3-transition'
import { text } from 'd3-fetch'

import CloseButton from './CloseButton'
import encodeForPost from '../encodeForPost'

import css from './LoginModal.css'

export default class LoginModal extends React.Component {
  constructor (props) {
    super()
    this.changePassword = this.changePassword.bind(this)
    this.state = {
      passwordMismatchWarning: false
    }
  }

  async changePassword () {
    if (this.newPassword1.value !== this.newPassword2.value) {
      this.setState({ passwordMismatchWarning: true })
      return
    }
    const data = {
      oldPassword: this.oldPassword.value,
      newPassword: this.newPassword1.value
    }

    const response = await text('.netlify/functions/changePassword', {
      headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      method: 'POST',
      body: JSON.stringify(data)
    })

    if (response === 'true') {
      this.props.onClose()
    }
  }

  render () {
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header>
          <CloseButton onClick={this.props.onClose} />
        </Modal.Header>
        <Modal.Body>
          <div className={css.loginGrid} ref={this.shaker}>
            <div className={css.prompt}>old password</div>
            <div>
              <input ref={(input) => { this.oldPassword = input }} type='password' />
            </div>
            <div className={css.prompt}>new password</div>
            <div>
              <input ref={(input) => { this.newPassword1 = input }} type='password' />
            </div>
            <div className={css.prompt}>repeat new password</div>
            <div>
              <input
                style={{ border: this.state.passwordMismatchWarning ? '1pt solid red' : '' }}
                ref={(input) => { this.newPassword2 = input }}
                onKeyUp={() => this.setState({ passwordMismatchWarning: false })}
                type='password'
              />
            </div>
            <div />
            <div>
              <button onClick={this.changePassword}>change password</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}
