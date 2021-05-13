/* eslint-disable react/jsx-handler-names */

import React from 'react'
import { text } from 'd3-fetch'

import ChangePasswordModal from './ChangePasswordModal'
import encodeForPost from '../encodeForPost'
import css from './SettingsPanel.css'

export default class SettingsPanel extends React.Component {
  constructor () {
    super()
    this.closeModal = this.closeModal.bind(this)
    this.openModal = this.openModal.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
    this.state = {
      isShowingModal: false,
      saving: false
    }
  }

  closeModal () {
    this.setState({ isShowingModal: false })
  }

  openModal () {
    this.setState({ isShowingModal: true })
  }

  async saveChanges () {
    const user = this.props.players.find((p) => p._id === this.props.userId)
    if (!user) {
      return
    }
    user.settings.email = this.email.value
    this.setState({ saving: true })
    await text('.netlify/functions/saveSettings', {
      headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      method: 'POST',
      body: JSON.stringify(user.settings)
    })
    setTimeout(() => {
      this.setState({ saving: false })
    }, 1000)
  }

  render () {
    let user = null
    if (this.props.userId) {
      user = this.props.players.find((p) => p._id === this.props.userId)
    }

    if (!user) {
      return null
    }

    return (
      <div style={{ overflowY: 'scroll' }} className={css.settingsGrid}>
        <div className={css.prompt}>name</div>
        <div>
          {user.name}
        </div>
        <div className={css.prompt}>password</div>
        <div>
          <button onClick={this.openModal}>change password</button>
        </div>
        <div className={css.prompt}>email address</div>
        <div>
          <input type='text' ref={(input) => { this.email = input }} defaultValue={user.settings.email} />
        </div>
        <div />
        <div className={css.saveButtonContainer}>
          {
            this.state.saving
              ? 'saving...'
              : <button className={css.saveButton} onClick={this.saveChanges}>save changes</button>
          }
        </div>
        <ChangePasswordModal
          show={this.state.isShowingModal}
          onClose={this.closeModal}
        />
      </div>
    )
  }
}
