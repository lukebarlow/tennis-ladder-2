/* eslint-disable react/jsx-handler-names */

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

function latitudeAndLogitudeFromPosition(position, currentLongitude) {
  const [x, y, z] = position
  const h = Math.sqrt(x * x + z * z)

  let longitude = ThreeMath.radToDeg(Math.atan2(x, -z))

  while (longitude - currentLongitude > 180) {
    longitude -= 360
  }

  while (currentLongitude - longitude > 180) {
    longitude += 360
  }

  const latitude = ThreeMath.radToDeg(Math.atan2(-y, h))

  return {
    longitude,
    latitude
  }
}

export default class Ball extends React.Component {
  constructor (props) {
    super(props)
    this.ballReadyHandler = this.ballReadyHandler.bind(this)
    this.tick = this.tick.bind(this)
    this.windowResizeHandler = this.windowResizeHandler.bind(this)
    this.mouseDownHandler = this.mouseDownHandler.bind(this)
    this.mouseUpHandler = this.mouseUpHandler.bind(this)
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
    this.imageLoadedHandler = this.imageLoadedHandler.bind(this)
    this.scenes = []

    const { position } = this.props.panels[this.props.selectedPanel]
    const { 
      latitude, 
      longitude 
    } = latitudeAndLogitudeFromPosition(position, this.longitude)

    this.latitude = latitude
    this.longitude = longitude
    this.targetLatitude = latitude
    this.targetLongitude = longitude
    this.animating = false
  }

  componentDidMount () {
    

    window.addEventListener('resize', this.windowResizeHandler, false)
    this.tick()
  }

  componentDidUpdate () {
    const { position } = this.props.panels[this.props.selectedPanel]
    const { 
      latitude: targetLatitude, 
      longitude: targetLongitude 
    } = latitudeAndLogitudeFromPosition(position, this.longitude)

    if (targetLatitude !== this.targetLatitude || targetLongitude !== this.targetLongitude) {
      this.targetLatitude = targetLatitude
      this.targetLongitude = targetLongitude
      if (!this.animating) {
        this.animating = true
        this.tick()
      }
    }
  }

  windowResizeHandler () {
    for (const { camera, renderer } of this.scenes) {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
  }

  ballReadyHandler (scene, camera, renderer) {
    this.scenes.push({ scene, camera, renderer })
  }

  imageLoadedHandler () {
    this.tick()
  }

  tick () {
    const dLat = (this.targetLatitude - this.latitude) / 30
    const dLon = (this.targetLongitude - this.longitude) / 30

    this.latitude += dLat
    this.longitude += dLon
    const phi = ThreeMath.degToRad(90 + this.latitude)
    const theta = ThreeMath.degToRad(this.longitude)
    const x = Math.sin(phi) * Math.sin(theta)
    const y = Math.cos(phi)
    const z = -1 * Math.sin(phi) * Math.cos(theta)
    const target = new Vector3(x, y, z)

    for (const { scene, camera, renderer } of this.scenes) {
      camera.lookAt(target)
      renderer.render(scene, camera)
    }

    if (Math.abs(dLat) < 0.001 && Math.abs(dLon) < 0.001) {
      this.animating = false
    }

    if (this.animating) {
      window.requestAnimationFrame(this.tick)
    }
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

    this.longitude -= movementX / 20
    this.targetLongitude = this.longitude

    this.latitude -= movementY / 8
    if (Math.abs(this.latitude) > 89) {
      this.latitude = Math.sign(this.latitude) * 89
    }
    this.targetLatitude = this.latitude
    this.tick()

    event.preventDefault()
  }

  render () {
    const { userId, isAdmin, players, panels, config } = this.props

    return (
      <div onMouseDown={this.mouseDownHandler}>
        <BackgroundBall
          onReady={this.ballReadyHandler}
          onImageLoaded={this.imageLoadedHandler}
        />
        <CssBall
          userId={userId}
          isAdmin={isAdmin}
          players={players}
          panels={panels}
          config={config}
          onReady={this.ballReadyHandler}
          onChange={this.props.onChange}
        />
      </div>
    )
  }
}
