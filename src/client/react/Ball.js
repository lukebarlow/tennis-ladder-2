/* this component contains both the tennis court panoramic
   background, and all the panels which rotate on the inside
   of the ball.

   It handles clicking and dragging to move to other parts
   of the ball, and automatic navigation when you click
   a navigation link
*/

import React from 'react'

import CssBall from './CssBall'
import BackgroundBall from './BackgroundBall'

export default class Ball extends React.Component {
  render () {
    const { userId } = this.props
    return <>
      <BackgroundBall />
      <CssBall userId={userId} />
    </>
  }
}
