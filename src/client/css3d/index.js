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

import SinglesPanel from '../components/SinglesPanel'
import DoublesLadderContainer from '../components/DoublesLadderContainer'

var camera, scene, renderer
var geometry, material, mesh
var target = new Vector3()

var lon = 90, lat = 0
var phi = 0, theta = 0

var touchX, touchY

let _userId = null
let panelRenderings = []

init()
animate()

function renderAllPanels () {
  for (let { component, element} of panelRenderings) {
    render(React.createElement(component, { userId: _userId }), element)
  }
}

function init () {
  camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)

  scene = new Scene()

  var sides = [
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

  for (var i = 0; i < sides.length; i++) {
    var side = sides[ i ]

    // var element = document.createElement('img')
    // element.width = 1026 // 2 pixels extra to close the gap.
    // element.src = side.url

    var element = document.createElement('div')
    element.setAttribute('class', 'card')
    element.style.width = '60%'
    element.style.height = '50%'

    if (side.component) {
      // render(side.component, element)
      panelRenderings.push({
        component: side.component,
        element: element
      })
    } else {
      element.innerHTML = 'HELLO. This is some text which we will show'
    }

    var object = new CSS3DObject(element)
    object.position.fromArray(side.position)
    object.rotation.fromArray(side.rotation)
    scene.add(object)
  }

  renderer = new CSS3DRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.getElementById('panels').appendChild(renderer.domElement)
  // document.body.appendChild(renderer.domElement)

  //

  // document.addEventListener('mousedown', onDocumentMouseDown, false)
  // document.addEventListener('wheel', onDocumentMouseWheel, false)

  // document.addEventListener('touchstart', onDocumentTouchStart, false)
  // document.addEventListener('touchmove', onDocumentTouchMove, false)

  window.addEventListener('resize', onWindowResize, false)
  renderAllPanels()
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

// function onDocumentMouseDown (event) {
//   event.preventDefault()

//   document.addEventListener('mousemove', onDocumentMouseMove, false)
//   document.addEventListener('mouseup', onDocumentMouseUp, false)
// }

// function onDocumentMouseMove (event) {
//   var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
//   var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0

//   lon -= movementX * 0.1
//   lat += movementY * 0.1
// }

// function onDocumentMouseUp (event) {
//   document.removeEventListener('mousemove', onDocumentMouseMove)
//   document.removeEventListener('mouseup', onDocumentMouseUp)
// }

// function onDocumentMouseWheel (event) {
//   var fov = camera.fov + event.deltaY * 0.05

//   camera.fov = ThreeMath.clamp(fov, 10, 75)

//   camera.updateProjectionMatrix()
// }

// function onDocumentTouchStart (event) {
//   event.preventDefault()

//   var touch = event.touches[ 0 ]

//   touchX = touch.screenX
//   touchY = touch.screenY
// }

// function onDocumentTouchMove (event) {
//   event.preventDefault()

//   var touch = event.touches[ 0 ]

//   lon -= (touch.screenX - touchX) * 0.1
//   lat += (touch.screenY - touchY) * 0.1

//   touchX = touch.screenX
//   touchY = touch.screenY
// }

function animate () {
  requestAnimationFrame(animate)

  // lon += 0.1
  lat = Math.max(-85, Math.min(85, lat))
  phi = ThreeMath.degToRad(90 - lat)
  theta = ThreeMath.degToRad(lon)

  target.x = Math.sin(phi) * Math.cos(theta)
  target.y = Math.cos(phi)
  target.z = Math.sin(phi) * Math.sin(theta)

  camera.lookAt(target)

  renderer.render(scene, camera)
}

function goTo (_lon, _lat) {
  lon = _lon
  lat = _lat
}

function userId (__userId) {
  if (!arguments.length) {
    return _userId
  }
  _userId = __userId
  return this
}

function update () {
  renderAllPanels()
}

export default {
  userId,
  goTo,
  update
}
