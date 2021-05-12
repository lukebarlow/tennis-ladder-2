import React from 'react'

import {
  CubeTextureLoader,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Color
} from 'three'

const imageEndings = [ 
  'pos-x.jpg', 'neg-x.jpg', 
  'pos-y.jpg', 'neg-y.jpg', 
  'pos-z.jpg', 'neg-z.jpg' 
]

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

    const loader1 = new CubeTextureLoader()
    loader1.setPath( 'images/beside-the-court-initial/beside-' )
    const textureCube1 = loader1.load( imageEndings, () => {
      scene.background = textureCube1
      onImageLoaded()
      // once low res images are loaded, start the hi res
      const loader2 = new CubeTextureLoader()
      loader2.setPath( 'images/beside-the-court/beside-' )
      const textureCube2 = loader2.load( imageEndings, () => {
        scene.background = textureCube2
        onImageLoaded()
      })
    } )

    const renderer = this.renderer = new WebGLRenderer({ alpha: true })
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
