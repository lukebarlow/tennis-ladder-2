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
import OldCssBall from './OldCssBall'

export default class Ball extends React.Component {
  constructor () {
    super()
    this.ballReadyHandler = this.ballReadyHandler.bind(this)
    this.tick = this.tick.bind(this)
    this.windowResizeHandler = this.windowResizeHandler.bind(this)
    this.mouseDownHandler = this.mouseDownHandler.bind(this)
    this.mouseUpHandler = this.mouseUpHandler.bind(this)
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
    this.scenes = []
    this.latitude = 20
    this.longitude = 10
    this.targetLatitude = 20
    this.targetLongitude = 10
  }

  componentDidMount () {
    window.addEventListener('resize', this.windowResizeHandler, false)
    this.tick()
  }

  componentDidUpdate () {
    // const { position } = this.props.panels[this.props.selectedPanel]
    // const [x, y, z] = position
    // const h = Math.sqrt(x * x + z * z)
    // this.targetLongitude = ThreeMath.radToDeg(Math.atan2(x, -z))
    // console.log('x', x, 'z', z)
    // console.log('targetLongitude', this.targetLongitude)
    // this.targetLatitude = ThreeMath.radToDeg(Math.atan2(y, h))
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

  // const lat = this.targetLatitude - this.latitude
  // const lon = this.targetLongitude - this.longitude

  // const dLat = Math.sign(lat) * Math.min(Math.abs(lon), 1)
  // const dLon = Math.sign(lon) * Math.min(Math.abs(lon, 1))

  // // this.latitude += 

  // if (dLat !== 0 || dLon !== 0) {
  //   this.latitude += dLat
  //   this.longitude += dLon

  tick () {
    this.latitude += (this.targetLatitude - this.latitude) / 30
    this.longitude += (this.targetLongitude - this.longitude) / 30

    const phi = ThreeMath.degToRad(90 - this.latitude)
    const theta = ThreeMath.degToRad(this.longitude)
    const x = Math.sin(phi) * Math.sin(theta)
    const y = Math.cos(phi)
    const z = -1 * Math.sin(phi) * Math.cos(theta)
    const target = new Vector3(x, y, z)

    for (let { scene, camera, renderer } of this.scenes) {
      camera.lookAt(target)
      renderer.render(scene, camera)
    }
    // i++
    // if (i < 10) {
    window.requestAnimationFrame(this.tick)
    // }
  }

  mouseDownHandler () {
    document.addEventListener('mouseup', this.mouseUpHandler, false)
    document.addEventListener('mousemove', this.mouseMoveHandler, false)
  }

  mouseUpHandler () {
    document.removeEventListener('mouseup', this.mouseUpHandler)
    document.removeEventListener('mousemove', this.mouseMoveHandler)
  }

  mouseMoveHandler (event) {
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0
    // console.log(movementX, movementY)

    this.longitude += movementX
    this.targetLongitude = this.longitude

    this.latitude += movementY
    this.targetLatitude = this.latitude
  }

  render () {
    const { userId, players, panels } = this.props
    return <div onMouseDown={this.mouseDownHandler}>
      <BackgroundBall
        panels={panels}
        onReady={this.ballReadyHandler}
      />
      <CssBall
        userId={userId}
        players={players}
        panels={panels}
        onReady={this.ballReadyHandler}
        onChange={this.props.onChange}
      />
      {/* <OldCssBall
        userId={userId}
        players={players}
        panels={panels}
        onReady={this.ballReadyHandler}
        onChange={this.props.onChange}
      /> */}
    </div>
  }
}
