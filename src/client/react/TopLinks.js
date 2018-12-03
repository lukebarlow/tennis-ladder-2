import React from 'react'
import LoginModal from './LoginModal'
import { text } from 'd3-fetch'

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
    await text('logout')
    this.props.onLogout()
  }

  render () {
    return <span id='top-links'>
      <a id='singles' onClick={() => this.props.onGoTo('singles')}>singles</a>
      <a id='doubles' onClick={() => this.props.onGoTo('doubles')}>doubles</a>
      {
        this.props.userId
          ? <>
            {/* <a id='settings' onClick={() => this.props.onGoTo('settings')}>settings</a> */}
            <a id='logout' onClick={this.logoutHandler}>log out</a>
          </>
          : <a id='settings' onClick={this.openModal}>log in</a>
      }
      <LoginModal show={this.state.isShowingModal} onClose={this.closeModal} onLogin={this.loginHandler} />
    </span>
  }
}
