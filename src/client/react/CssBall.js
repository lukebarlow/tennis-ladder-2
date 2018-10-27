/* 
  this is the ball containing the html panels which are spun
  around by css
*/

import React from 'react'

import { render } from 'react-dom'

import {
  Vector3,
  PerspectiveCamera,
  Scene,
  Math as ThreeMath
} from 'three'

import {
  CSS3DObject,
  CSS3DRenderer
} from 'three-css3drenderer'

import SinglesPanel from './SinglesPanel'
import DoublesLadderContainer from './DoublesLadderContainer'

const panels = [
  {
    position: [ -512, 0, 0 ],
    rotation: [ 0, Math.PI / 2, 0 ],
    component: SinglesPanel
  },
  {
    position: [ 512, 0, 0 ],
    rotation: [ 0, -Math.PI / 2, 0 ],
    component: DoublesLadderContainer
  }
  // {
  //   position: [ 0, 512, 0 ],
  //   rotation: [ Math.PI / 2, 0, Math.PI ]

  // },
  // {
  //   position: [ 0, -512, 0 ],
  //   rotation: [ -Math.PI / 2, 0, Math.PI ]
  // },
  // {
  //   position: [ 0, 0, 512 ],
  //   rotation: [ 0, Math.PI, 0 ]
  // },
  // {
  //   position: [ 0, 0, -512 ],
  //   rotation: [ 0, 0, 0 ]
  // }
]

export default class CssBall extends React.Component {
  constructor () {
    super()
    this.tick = this.tick.bind(this)
    this.main = React.createRef()
    this.panelRenderings = []
  }

  componentDidMount () {
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    const scene = this.scene = new Scene()

    //for (var i = 0; i < sides.length; i++) {
    for (let panel of panels) {
    
      // var element = document.createElement('img')
      // element.width = 1026 // 2 pixels extra to close the gap.
      // element.src = side.url
  
      var element = document.createElement('div')
      element.setAttribute('class', 'card')
      element.style.width = '60%'
      element.style.height = '50%'
  
      if (panel.component) {
        // render(side.component, element)
        this.panelRenderings.push({
          component: panel.component,
          element: element
        })
      } else {
        element.innerHTML = 'Add a React class to render the panel'
      }
  
      var object = new CSS3DObject(element)
      object.position.fromArray(panel.position)
      object.rotation.fromArray(panel.rotation)
      scene.add(object)
    }

    const renderer = this.renderer = new CSS3DRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)

    window.main = this.main.current
    this.main.current.appendChild(renderer.domElement)

    window.addEventListener('resize', this.windowResizeHandler.bind(this), false)
    this.renderAllPanels()

    this.tick()
  }

  componentDidUpdate () {
    this.renderAllPanels()
  }

  windowResizeHandler () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  renderAllPanels () {
    for (let { component, element } of this.panelRenderings) {
      render(React.createElement(component, this.props), element)
    }
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
    return <div id="panels" ref={this.main} />
  }
}
