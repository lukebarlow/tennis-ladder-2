/*
  this is the ball containing the html panels which are spun
  around by css
*/

import React from 'react'

import { render } from 'react-dom'

import {
  PerspectiveCamera,
  Scene
} from 'three'

import {
  CSS3DObject,
  CSS3DRenderer
} from 'three-css3drenderer'

export default class CssBall extends React.Component {
  constructor () {
    super()
    this.main = React.createRef()
    this.panelRenderings = []
  }

  componentDidMount () {
    const camera = this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    const scene = this.scene = new Scene()

    for (let entry of Object.entries(this.props.panels)) {
      const panel = entry[1]
      var element = document.createElement('div')
      element.setAttribute('class', 'card')
      element.style.width = 'calc(100% - 300px)'
      element.style.maxWidth = '800px'
      element.style.minWidth = '460px'
      element.style.height = 'calc(100% - 300px)'

      if (panel.component) {
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

    this.renderAllPanels()
    this.props.onReady(scene, camera, renderer)
  }

  componentDidUpdate () {
    this.renderAllPanels()
  }

  renderAllPanels () {
    for (let { component, element } of this.panelRenderings) {
      render(React.createElement(component, this.props), element)
    }
  }

  render () {
    return <div id='panels' ref={this.main} />
  }
}
