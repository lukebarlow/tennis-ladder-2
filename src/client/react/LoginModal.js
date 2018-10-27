import React from 'react'
import {
  Button,
  Modal
} from 'react-bootstrap'
import { select } from 'd3-selection'
import 'd3-transition'
import { text } from 'd3-fetch'
import { easeLinear } from 'd3-ease'

import encodeForPost from '../encodeForPost'

export default class LoginModal extends React.Component {
  constructor (props) {
    super()
    this.login = this.login.bind(this)
  }

  shakeLogin () {
    select(this.loginTable)
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
      headers: {'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      method: 'POST',
      body: encodeForPost(data)
    })

    let userId

    if (response == 'false') {
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


    // text('login')
    //   .header('Content-type', 'application/x-www-form-urlencoded')
    //   .post(name = `name=${this.nameInput.value}&password=${this.passwordInput.value}`, (error, response) => {
    //     // console.log('got the result', error, text)
    //     let userId

    //     if (response == 'false') {
    //       userId = null
    //     } else {
    //       userId = response
    //     }

    //     if (userId) {
    //       this.nameInput.value = ''
    //       this.passwordInput.value = ''
    //       this.props.onLogin(userId)
    //     } else {
    //       this.shakeLogin()
    //     }
    //   })
  }

  render () {
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header >
          <Button onClick={this.props.onClose}>Close</Button>
        </Modal.Header>
        <Modal.Body>
          <table id='loginTable' style={{position: 'relative'}} ref={(el) => { this.loginTable = el }}>
            <tbody>
              <tr>
                <td style={{textAlign: 'right'}}>name</td>
                <td><input ref={(input) => { this.nameInput = input }} type='text' id='name' /></td>
              </tr>
              <tr>
                <td>password</td>
                <td><input ref={(input) => { this.passwordInput = input }} type='password' id='password' /></td>
              </tr>
              <tr>
                <td />
                <td style={{textAlign: 'right'}}><button id='loginButton' onClick={this.login}>login</button></td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    )
  }
}
