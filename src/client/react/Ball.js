/* this component contains both the tennis court panoramic
   background, and all the panels which rotate on the inside
   of the ball.

   It handles clicking and dragging to move to other parts
   of the ball, and automatic navigation when you click
   a navigation link
*/

import React from 'react'

import {
  Vector3,
  Math as ThreeMath
} from 'three'

import CssBall from './CssBall'
import BackgroundBall from './BackgroundBall'
import panels from './panels'

export default class Ball extends React.Component {
  constructor () {
    super()
    this.ballReadyHandler = this.ballReadyHandler.bind(this)
    this.tick = this.tick.bind(this)
    this.windowResizeHandler = this.windowResizeHandler.bind(this)
    this.scenes = []
    this.latitude = 0
    this.longitude = 180
    this.targetLatitude = 0
    this.targetLongitude = 180
  }

  componentDidMount () {
    window.addEventListener('resize', this.windowResizeHandler, false)
    this.tick()
  }

  componentDidUpdate () {
    const { position } = panels[this.props.selectedPanel]
    const [x, y, z] = position
    const h = Math.sqrt(x * x + z * z)
    this.targetLongitude = ThreeMath.radToDeg(Math.atan2(z, x))
    this.targetLatitude = ThreeMath.radToDeg(Math.atan2(y, h))
  }

  windowResizeHandler () {
    for (let { camera, renderer } of this.scenes) {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
  }

  ballReadyHandler (scene, camera, renderer) {
    this.scenes.push({ scene, camera, renderer })
  }

  tick () {
    this.latitude += (this.targetLatitude - this.latitude) / 30
    this.longitude += (this.targetLongitude - this.longitude) / 30

    const phi = ThreeMath.degToRad(90 - this.latitude)
    const theta = ThreeMath.degToRad(this.longitude)
    const x = Math.sin(phi) * Math.cos(theta)
    const y = Math.cos(phi)
    const z = Math.sin(phi) * Math.sin(theta)
    const target = new Vector3(x, y, z)

    for (let { scene, camera, renderer } of this.scenes) {
      camera.lookAt(target)
      renderer.render(scene, camera)
    }

    window.requestAnimationFrame(this.tick)
  }

  render () {
    const { userId, players, panels } = this.props
    return <>
      <BackgroundBall
        panels={panels}
        onReady={this.ballReadyHandler}
      />
      <CssBall
        userId={userId}
        players={players}
        panels={panels}
        onReady={this.ballReadyHandler}
      />
    </>
  }
}
