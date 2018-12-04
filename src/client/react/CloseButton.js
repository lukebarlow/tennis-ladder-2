import React from 'react'

import css from './CloseButton.css'

class CloseButton extends React.Component {
  render () {
    const size = this.props.size || 30
    return <svg
      className={css.closeButton}
      onClick={this.props.onClick}
      style={{ width: size, height: size }}
    >
      <title>Close</title>
      <line x1={0} y1={0} x2={size} y2={size} />
      <line x1={0} y1={size} x2={size} y2={0} />
    </svg>
  }
}

export default CloseButton
