import React from 'react'

import {
  TextureLoader,
  WebGLRenderer,
  PerspectiveCamera,
  Mesh,
  MeshBasicMaterial,
  Vector3,
  Scene,
  SphereBufferGeometry,
  Math as ThreeMath
} from 'three'

export default class BackgroundBall extends React.Component {
  constructor () {
    super()
    this.tick = this.tick.bind(this)
    this.main = React.createRef()
  }

  componentDidMount () {
    const container = this.main.current
    const camera = this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100)
    const scene = this.scene = new Scene()
    const geometry = new SphereBufferGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)
    var material = new MeshBasicMaterial({
      map: new TextureLoader().load('images/clay-court-hi-res.jpg')
    })

    const mesh = new Mesh(geometry, material)
    scene.add(mesh)

    const renderer = this.renderer = new WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    window.addEventListener('resize', this.windowResizeHandler.bind(this), false)
  
    // window.requestAnimationFrame(this.tick.bind(this))
    this.tick()
  }

  windowResizeHandler () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  tick () {
    const latitude = this.props.latitude || 0
    const longitude = this.props.longitude || 180
    const phi = ThreeMath.degToRad(90 - latitude)
    const theta = ThreeMath.degToRad(longitude)
    const x = Math.sin(phi) * Math.cos(theta)
    const y = Math.cos(phi)
    const z = Math.sin(phi) * Math.sin(theta)
    const target = new Vector3(x, y, z)
    this.camera.lookAt(target)
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  render () {
    return <div id="background-ball" ref={this.main} />
  }
}