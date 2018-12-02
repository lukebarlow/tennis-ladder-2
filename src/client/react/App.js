/* The overall App */

import React from 'react'
import { text, json } from 'd3-fetch'

import TopLinks from './TopLinks'
import Ball from './Ball'

import panels from './panels'

export default class App extends React.Component {
  constructor () {
    super()
    this.loginHandler = this.loginHandler.bind(this)
    this.logoutHandler = this.logoutHandler.bind(this)
    this.goToHandler = this.goToHandler.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
    this.init()
    this.state = {
      userId: null,
      selectedPanel: 'singles',
      players: null
    }
  }

  async init () {
    const userId = await text('./userId')
    const players = await json('./players')
    this.setState({ userId, players })
  }

  loginHandler (userId) {
    this.setState({ userId })
  }

  logoutHandler () {
    this.setState({ userId: null })
  }

  goToHandler (location) {
    this.setState({ selectedPanel: location })
  }

  async changeHandler () {
    const players = await json('./players')
    this.setState({ players })
  }

  render () {
    return <>
      <Ball
        userId={this.state.userId}
        panels={panels}
        selectedPanel={this.state.selectedPanel}
        players={this.state.players}
        onChange={this.changeHandler}
      />
      <TopLinks
        userId={this.state.userId}
        onLogin={this.loginHandler}
        onLogout={this.logoutHandler}
        onGoTo={this.goToHandler}
      />
    </>
  }
}
