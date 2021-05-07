/* eslint-disable react/jsx-handler-names */

/* The overall App */

import React from 'react'
import { json } from 'd3-fetch'

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
    const { userId, isAdmin } = await json('/.netlify/functions/userDetails')
    const players = await json('/.netlify/functions/players')
    const config = await json('/.netlify/functions/config')
    this.setState({ userId, isAdmin, players, config })
  }

  async loginHandler (userId) {
    const { isAdmin } = await json('/.netlify/functions/userDetails')
    this.setState({ userId, isAdmin })
  }

  logoutHandler () {
    this.setState({ userId: null, isAdmin: false })
  }

  goToHandler (location) {
    this.setState({ selectedPanel: location })
  }

  async changeHandler () {
    const players = await json('/.netlify/functions/players')
    this.setState({ players })
  }

  render () {
    const { userId, config, selectedPanel, isAdmin, players } = this.state
    return (
      <>
        <Ball
          userId={userId}
          isAdmin={isAdmin}
          config={config}
          panels={panels}
          selectedPanel={selectedPanel}
          players={players}
          onChange={this.changeHandler}
        />
        <TopLinks
          userId={userId}
          isAdmin={isAdmin}
          onLogin={this.loginHandler}
          onLogout={this.logoutHandler}
          onGoTo={this.goToHandler}
        />
      </>
    )
  }
}
