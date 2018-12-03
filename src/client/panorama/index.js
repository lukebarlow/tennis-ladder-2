// import {
//   TextureLoader,
//   WebGLRenderer,
//   PerspectiveCamera,
//   Mesh,
//   MeshBasicMaterial,
//   Vector3,
//   Scene,
//   SphereBufferGeometry,
//   Math as ThreeMath
// } from 'three'

// import { select } from 'd3-selection'

// var camera, scene, renderer

// let phi = 0
// let theta = 0
// let lat = 0
// let lon = 0

// init()
// animate()

// function init () {
//   var container, mesh

//   container = document.getElementById('container')

//   camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100)
//   camera.target = new Vector3(0, 0, 0)

//   scene = new Scene()

//   var geometry = new SphereBufferGeometry(500, 60, 40)
//   // invert the geometry on the x-axis so that all of the faces point inward
//   geometry.scale(-1, 1, 1)

//   var material = new MeshBasicMaterial({
//     map: new TextureLoader().load('images/clay-court-hi-res.jpg')
//   })

//   mesh = new Mesh(geometry, material)

//   scene.add(mesh)

//   renderer = new WebGLRenderer()
//   renderer.setPixelRatio(window.devicePixelRatio)
//   renderer.setSize(window.innerWidth, window.innerHeight)
//   container.appendChild(renderer.domElement)

//   // document.addEventListener('dragover', function (event) {
//   //   event.preventDefault()
//   //   event.dataTransfer.dropEffect = 'copy'
//   // }, false)

//   // document.addEventListener('dragenter', function (event) {
//   //   document.body.style.opacity = 0.5
//   // }, false)

//   // document.addEventListener('dragleave', function (event) {
//   //   document.body.style.opacity = 1
//   // }, false)

//   // document.addEventListener('drop', function (event) {
//   //   event.preventDefault()

//   //   var reader = new FileReader()
//   //   reader.addEventListener('load', function (event) {
//   //     material.map.image.src = event.target.result
//   //     material.map.needsUpdate = true
//   //   }, false)
//   //   reader.readAsDataURL(event.dataTransfer.files[ 0 ])

//   //   document.body.style.opacity = 1
//   // }, false)

//   //

//   window.addEventListener('resize', onWindowResize, false)
// }

// function onWindowResize () {
//   camera.aspect = window.innerWidth / window.innerHeight
//   camera.updateProjectionMatrix()
//   renderer.setSize(window.innerWidth, window.innerHeight)
// }

// function animate () {
//   requestAnimationFrame(animate)
//   update()
// }

// window.select = select

// function update () {
//   lat = Math.max(-85, Math.min(85, lat))
//   phi = ThreeMath.degToRad(90 - lat)
//   theta = ThreeMath.degToRad(lon)

//   camera.target.x = 500 * Math.sin(phi) * Math.cos(theta)
//   camera.target.y = 500 * Math.cos(phi)
//   camera.target.z = 500 * Math.sin(phi) * Math.sin(theta)

//   camera.lookAt(camera.target)
//   renderer.render(scene, camera)
// }

// function goTo (_lon, _lat) {
//   lon = _lon
//   lat = _lat
// }

// export default { goTo }
