/* eslint-disable react/jsx-handler-names */

import React from 'react'
import {
  Modal
} from 'react-bootstrap'
import { select } from 'd3-selection'
import 'd3-transition'
import { text } from 'd3-fetch'
import { easeLinear } from 'd3-ease'

import CloseButton from './CloseButton'
import encodeForPost from '../encodeForPost'

import css from './LoginModal.css'

export default class LoginModal extends React.Component {
  constructor (props) {
    super()
    this.login = this.login.bind(this)
    this.shaker = React.createRef()
    this.shakeLogin = this.shakeLogin.bind(this)
  }

  shakeLogin () {
    select(this.shaker.current)
      .transition()
      .duration(500)
      .ease(easeLinear)
      .styleTween('left', function (d, i, a) {
        return function (t) {
          return -10 * Math.sin(t * Math.PI * 4) + 'px'
        }
      })
  }

  async login () {
    const data = {
      name: this.nameInput.value,
      password: this.passwordInput.value
    }

    const response = await text('login', {
      headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      method: 'POST',
      body: encodeForPost(data)
    })

    let userId

    if (response === 'false') {
      userId = null
    } else {
      userId = response
    }

    if (userId) {
      this.nameInput.value = ''
      this.passwordInput.value = ''
      this.props.onLogin(userId)
    } else {
      this.shakeLogin()
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
            <div className={css.prompt}>name</div>
            <div>
              <input ref={(input) => { this.nameInput = input }} type='text' id='name' />
            </div>
            <div className={css.prompt}>password</div>
            <div>
              <input ref={(input) => { this.passwordInput = input }} type='password' id='password' />
            </div>
            <div />
            <div className={css.loginButtonContainer}>
              <button className={css.loginButton} onClick={this.login}>login</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}
