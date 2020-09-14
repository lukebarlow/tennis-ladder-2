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
} from '../CSS3DRenderer'

import css from './CssBall.css'

export default class CssBall extends React.Component {
  constructor () {
    super()
    this.main = React.createRef()
    this.panelRenderings = []
  }

  componentDidMount () {
    const camera = this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)

    window.cssCamera = camera
    const scene = this.scene = new Scene()

    for (const [name, panel] of Object.entries(this.props.panels)) {
      var element = document.createElement('div')
      element.setAttribute('class', css.card)
      if (panel.component) {
        this.panelRenderings.push({
          name,
          panel,
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
    for (const { component, element, panel } of this.panelRenderings) {
      render(React.createElement(component, this.props), element)
      if (panel.visibleIf) {
        element.style.display = panel.visibleIf(this.props) ? 'block' : 'none'
      }
    }
  }

  render () {
    return <div id='panels' ref={this.main} />
  }
}
