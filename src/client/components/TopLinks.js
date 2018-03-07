import React from 'react'

export default class TopLinks extends React.Component {
  constructor () {
    super()
    this.state = {
      loggedIn: false
    }
    this.logIn = this.logIn.bind(this)
  }

  logIn () {
    console.log('do the login now')
  }

  // <a id='settings' onClick={() => navigator.goToLocation('settings')}>settings</a>

  render () {
    const navigator = this.props.navigator
    return <span>
      <a id='singles' onClick={() => navigator.goToLocation('singles')}>singles</a>
      <a id='doubles' onClick={() => navigator.goToLocation('doubles')}>doubles</a>
      <a id='settings' onClick={this.logIn}>log in</a>
    </span>
  }
}
