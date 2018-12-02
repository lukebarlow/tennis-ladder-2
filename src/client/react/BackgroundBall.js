import React from 'react'

import {
  TextureLoader,
  WebGLRenderer,
  PerspectiveCamera,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereBufferGeometry
} from 'three'

export default class BackgroundBall extends React.Component {
  constructor () {
    super()
    this.main = React.createRef()
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
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

    this.props.onReady(scene, camera, renderer)

    console.log('ready with mouse down')
  }

  onMouseDown () {
    console.log('got mouse down')
    this.dragging = true
    document.addEventListener('mouseup', this.onMouseUp, false)
    document.addEventListener('mousemove', this.onMouseMove, false)
  }

  onMouseUp () {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  onMouseMove () {
    console.log('moving the mouse')
  }

  render () {
    return <div
      id='background-ball'
      ref={this.main}
      onMouseDown={this.onMouseDown}
    />
  }
}
