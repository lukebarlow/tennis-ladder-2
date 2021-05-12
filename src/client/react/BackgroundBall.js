import React from 'react'

import {
  CubeTextureLoader,
  WebGLRenderer,
  PerspectiveCamera,
  Scene
} from 'three'

export default class BackgroundBall extends React.Component {
  constructor () {
    super()
    this.main = React.createRef()
  }

  componentDidMount () {
    const { onImageLoaded } = this.props
    const container = this.main.current
    const camera = this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100)
    const scene = this.scene = new Scene()

    const loader = new CubeTextureLoader()
    loader.setPath( 'images/beside-the-court/beside-' )

    const textureCube = loader.load( [ 
      'pos-x.jpg', 'neg-x.jpg', 
      'pos-y.jpg', 'neg-y.jpg', 
      'pos-z.jpg', 'neg-z.jpg' 
    ], () => {
      onImageLoaded()
    } )

    scene.background = textureCube

    const renderer = this.renderer = new WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    this.props.onReady(scene, camera, renderer)
  }

  render () {
    return (
      <div
        id='background-ball'
        ref={this.main}
      />
    )
  }
}
