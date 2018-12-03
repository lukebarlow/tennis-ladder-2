import React from 'react'

class CloseButton extends React.Component {
  render () {
    const size = this.props.size || 30
    return <svg
      className='closeButton'
      onClick={this.props.onClick}
      style={{ width: size, height: size, verticalAlign: 'bottom' }}
    >
      <title>Close</title>
      <line x1={0} y1={0} x2={size} y2={size} />
      <line x1={0} y1={size} x2={size} y2={0} />
    </svg>
  }
}

export default CloseButton
