/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 * @author mrdoob / http://mrdoob.com/
 */

var THREE = require('three')

window.THREE = THREE

function CSS3DObject (element) {
  THREE.Object3D.call(this)

  this.element = element
  this.element.style.position = 'absolute'

  this.addEventListener('removed', function () {
    if (this.element.parentNode !== null) {
      this.element.parentNode.removeChild(this.element)
    }
  })
};

CSS3DObject.prototype = Object.create(THREE.Object3D.prototype)
CSS3DObject.prototype.constructor = CSS3DObject
module.exports.CSS3DObject = CSS3DObject

const CSS3DSprite = function (element) {
  CSS3DObject.call(this, element)
}

CSS3DSprite.prototype = Object.create(CSS3DObject.prototype)
CSS3DSprite.prototype.constructor = CSS3DSprite
module.exports.CSS3DSprite = CSS3DSprite

//

function CSS3DRenderer () {
  var _width, _height
  var _widthHalf, _heightHalf

  var cache = {
    camera: { fov: 0, style: '' },
    objects: new WeakMap()
  }

  var domElement = document.createElement('div')
  domElement.style.overflow = 'hidden'

  this.domElement = domElement

  this.setClearColor = function () {}

  this.getSize = function () {
    return {
      width: _width,
      height: _height
    }
  }

  this.setSize = function (width, height) {
    _width = width
    _height = height
    _widthHalf = _width / 2
    _heightHalf = _height / 2

    domElement.style.width = width + 'px'
    domElement.style.height = height + 'px'
  }

  function epsilon (value) {
    return Math.abs(value) < 1e-10 ? 0 : value
  }

  function getObjectCSSMatrix (matrix) {
    var elements = matrix.elements.map(epsilon)
    return `matrix3d(${elements.join(',')})`
  }

  function renderObject (object, camera, cameraCSSMatrix) {
    if (object instanceof CSS3DObject) {
      var style

      var fov = camera.projectionMatrix.elements[ 5 ] * _heightHalf

      const mPosition = new THREE.Matrix4().setPosition(new THREE.Vector3(_widthHalf, _heightHalf, fov))

      const mCamera = camera.matrixWorldInverse.clone()

      // flip the x rotation of the camera
      mCamera.elements[6] = -mCamera.elements[6]
      mCamera.elements[9] = -mCamera.elements[9]

      // flip z rotation
      mCamera.elements[1] = -mCamera.elements[1]
      mCamera.elements[4] = -mCamera.elements[4]

      const mObject = object.matrixWorld

      const final = new THREE.Matrix4()
      final.multiply(mPosition)
      final.multiply(mCamera)
      final.multiply(mObject)

      style = 'translate(-50%,-50%) ' + getObjectCSSMatrix(final)

      var element = object.element

      window.objectElement = element

      var cachedStyle = cache.objects.get(object)

      if (cachedStyle === undefined || cachedStyle !== style) {
        element.style.WebkitTransform = style
        element.style.transform = style

        var objectData = { style: style }

        cache.objects.set(object, objectData)
      }

      if (element.parentNode !== domElement) {
        domElement.appendChild(element)
      }
    }

    for (var i = 0, l = object.children.length; i < l; i++) {
      renderObject(object.children[ i ], camera, cameraCSSMatrix)
    }
  }

  this.render = function (scene, camera) {
    var fov = camera.projectionMatrix.elements[ 5 ] * _heightHalf

    if (cache.camera.fov !== fov) {
      if (camera.isPerspectiveCamera) {
        domElement.style.WebkitPerspective = fov + 'px'
        domElement.style.perspective = fov + 'px'
      }

      cache.camera.fov = fov
    }

    scene.updateMatrixWorld()

    if (camera.parent === null) camera.updateMatrixWorld()

    renderObject(scene, camera)
  }
};

CSS3DRenderer.prototype = Object.create(THREE.EventDispatcher.prototype)
CSS3DRenderer.prototype.constructor = CSS3DRenderer
module.exports.CSS3DRenderer = CSS3DRenderer
