import React from 'react'
import css from './SettingsButton.css'

class SettingsButton extends React.Component {
  render () {
    const size = this.props.size || 20

    const teeth = 7
    const r = size / 3 // radius
    const da = Math.PI * 2 / teeth // angle per tooth
    const ada = da / 3 // part of the angle which is a smooth arc (instep)
    const tda = da - ada // total part of the angle which sticks out as the tooth
    const sda = tda / 3 // the angle travelled while sloping up the tooth
    const ftda = tda - (sda * 2) // the angle of the flat top part of the tooth
    const depth = r / 4 // the depth of the tooth sticking out from the radius
    const cr = r / 2 // radius of the inner circle

    // given an angle A and radius R, return the x, y
    // co-ordinates of that point round the circle
    const p = (A, R) => ([ Math.sin(A) * R, Math.cos(A) * R ])

    let path = `M 0 ${r} `

    let a = 0 // running total of angle
    while (a < Math.PI * 2) {
      const [x1, y1] = p(a + ada, r)
      path += `A ${r} ${r} 0 0 0 ${x1} ${y1} ` // the smoth instep bit
      const [x2, y2] = p(a + ada + sda, r + depth)
      path += `L ${x2} ${y2} `
      const [x3, y3] = p(a + ada + sda + ftda, r + depth)
      path += `L ${x3} ${y3} `
      const [x4, y4] = p(a + da, r)
      path += `L ${x4} ${y4} `
      a += da
    }

    // path += ' M -2.5,-2.5 h5v5h-5v-5z'
    path += `M 0 ${-cr} a ${cr} ${cr} 0 1 0 0.00001 0 z`

    return <svg style={{ width: size, height: size }} className={css.button} onClick={this.props.onClick}>
      <title>Settings</title>
      <g transform={'translate(' + (size / 2) + ',' + (size / 2) + ')'}>
        <circle r={size / 2.5} fill={this.props.on ? 'var(--button-selection-colour)' : 'transparent'} stroke='transparent' />
        <g>
          <path d={path} fillRule='evenodd' fill='white' />
        </g>
      </g>
    </svg>
  }
}

export default SettingsButton
