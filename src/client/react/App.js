/* The overall App */

import React from 'react'
import { text } from 'd3-fetch'

import TopLinks from './TopLinks'
import Ball from './Ball'

export default class App extends React.Component {
  constructor () {
    super()
    this.loginHandler = this.loginHandler.bind(this)
    this.logoutHandler = this.logoutHandler.bind(this)
    this.init()
    this.state = {
      userId: null
    }
  }

  async init () {
    const userId = await text('./userId')
    this.setState({ userId })
  }

  loginHandler (userId) {
    this.setState({ userId })
  }

  logoutHandler () {
    this.setState({ userId: null })
  }

  render () {
    return <>
      <Ball userId={this.state.userId} />
      <TopLinks userId={this.state.userId} onLogin={this.loginHandler} onLogout={this.logoutHandler} />
    </>
  }
}
