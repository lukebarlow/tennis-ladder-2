/* eslint-disable react/jsx-handler-names */

import React from 'react'
import { text } from 'd3-fetch'
import LoginModal from './LoginModal'
import SettingsButton from './SettingsButton'

export default class TopLinks extends React.Component {
  constructor () {
    super()
    this.state = {
      isShowingModal: false
    }
    this.loginHandler = this.loginHandler.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.openModal = this.openModal.bind(this)
    this.logoutHandler = this.logoutHandler.bind(this)
  }

  closeModal () {
    this.setState({ isShowingModal: false })
  }

  openModal () {
    this.setState({ isShowingModal: true })
  }

  loginHandler (userId) {
    this.setState({ isShowingModal: false })
    this.props.onLogin(userId)
  }

  async logoutHandler () {
    await text('.netlify/functions/logout')
    this.props.onLogout()
  }

  render () {
    return (
      <span id='top-links'>
        <a id='tom' onClick={() => this.props.onGoTo('tom')}>Tom</a>
        <a id='singles' onClick={() => this.props.onGoTo('singles')}>singles</a>
        <a id='doubles' onClick={() => this.props.onGoTo('doubles')}>doubles</a>
        {
          this.props.userId
            ? (
              <>
                <span style={{ paddingLeft: '15px', position: 'relative', top: '3px' }}>
                  <SettingsButton onClick={() => this.props.onGoTo('settings')} />
                </span>
                {
                  this.props.isAdmin && (
                    <a id='admin' onClick={() => this.props.onGoTo('admin')}>admin</a>
                  )
                }
                <a id='logout' onClick={this.logoutHandler}>log out</a>
              </>
            )
            : <a id='settings' onClick={this.openModal}>log in</a>
        }
        <LoginModal
          show={this.state.isShowingModal}
          onClose={this.closeModal}
          onLogin={this.loginHandler}
        />
      </span>
    )
  }
}
