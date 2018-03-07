import { selectAll } from 'd3-selection'

window.select = select

let scenes = []

let isUserInteracting = false
let isAnimatingToLocation = false
let onMouseDownMouseX = 0
let onMouseDownMouseY = 0
let lon = 180
let lat = 0
let onMouseDownLon = 0
let onMouseDownLat = 0

const locations = {
  singles: {
    lat: 0,
    lon: 180,
    colour: 'white'
  },
  doubles: {
    lat: 0,
    lon: 0,
    colour: 'white'
  },
  settings: {
    lat: 90,
    lon: 180,
    colour: 'white'
  }
}

let currentLocation = locations['singles']

function onDocumentMouseDown (event) {
  event.preventDefault()

  isUserInteracting = true

  onMouseDownMouseX = event.clientX
  onMouseDownMouseY = event.clientY

  onMouseDownLon = lon
  onMouseDownLat = lat
}

function onDocumentMouseMove (event) {
  if (isUserInteracting === true) {
    lon = (onMouseDownMouseX - event.clientX) * 0.1 + onMouseDownLon
    lat = (event.clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat
    goTo(lon, lat)
    isAnimatingToLocation = false
  }
}

function onDocumentMouseUp (event) {
  isUserInteracting = false
}

document.addEventListener('mousedown', onDocumentMouseDown, false)
document.addEventListener('mousemove', onDocumentMouseMove, false)
document.addEventListener('mouseup', onDocumentMouseUp, false)

function setScenes (_scenes) {
  scenes = _scenes
  goTo(lon, lat)
}

function goTo (lon, lat) {
  for (let scene of scenes) {
    scene.goTo(lon, lat)
  }
}

function animate () {
  if (isAnimatingToLocation) {
    requestAnimationFrame(animate)
  }

  let dLon = (currentLocation.lon - lon) / 50
  let dLat = (currentLocation.lat - lat) / 50

  isAnimatingToLocation = Math.abs(dLon) > 0.001 || Math.abs(dLat) > 0.001

  lon += dLon
  lat += dLat

  goTo(lon, lat)
}

function goToLocation (location) {
  console.log('going to location', location)

  if (locations[location]) {
    currentLocation = locations[location]

    selectAll('#nav a').style('color', currentLocation.colour)

    if (!isAnimatingToLocation) {
      isAnimatingToLocation = true
      animate()
    }
  }
}

export default {
  setScenes,
  goToLocation
}
