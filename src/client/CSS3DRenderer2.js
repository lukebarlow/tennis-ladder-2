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

  // var matrix = new THREE.Matrix4()

  var cache = {
    camera: { fov: 0, style: '' },
    objects: new WeakMap()
  }

  var domElement = document.createElement('div')
  domElement.style.overflow = 'hidden'

  this.domElement = domElement

  var cameraElement = document.createElement('div')

  cameraElement.style.WebkitTransformStyle = 'preserve-3d'
  cameraElement.style.transformStyle = 'preserve-3d'

  domElement.appendChild(cameraElement)

  var isIE = /Trident/i.test(navigator.userAgent)

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

    cameraElement.style.width = width + 'px'
    cameraElement.style.height = height + 'px'
  }

  function epsilon (value) {
    return Math.abs(value) < 1e-10 ? 0 : value
  }

  function getCameraCSSMatrix (matrix) {
    var elements = matrix.elements

    return 'matrix3d(' +
      epsilon(elements[ 0 ]) + ',' +
      epsilon(-elements[ 1 ]) + ',' +
      epsilon(elements[ 2 ]) + ',' +
      epsilon(elements[ 3 ]) + ',' +
      epsilon(elements[ 4 ]) + ',' +
      epsilon(-elements[ 5 ]) + ',' +
      epsilon(elements[ 6 ]) + ',' +
      epsilon(elements[ 7 ]) + ',' +
      epsilon(elements[ 8 ]) + ',' +
      epsilon(-elements[ 9 ]) + ',' +
      epsilon(elements[ 10 ]) + ',' +
      epsilon(elements[ 11 ]) + ',' +
      epsilon(elements[ 12 ]) + ',' +
      epsilon(-elements[ 13 ]) + ',' +
      epsilon(elements[ 14 ]) + ',' +
      epsilon(elements[ 15 ]) +
    ')'
  }

  function getObjectCSSMatrix (matrix) {
    var elements = matrix.elements
    var matrix3d = 'matrix3d(' +
      epsilon(elements[ 0 ]) + ',' +
      epsilon(elements[ 1 ]) + ',' +
      epsilon(elements[ 2 ]) + ',' +
      epsilon(elements[ 3 ]) + ',' +
      epsilon(-elements[ 4 ]) + ',' +
      epsilon(-elements[ 5 ]) + ',' +
      epsilon(-elements[ 6 ]) + ',' +
      epsilon(-elements[ 7 ]) + ',' +
      epsilon(elements[ 8 ]) + ',' +
      epsilon(elements[ 9 ]) + ',' +
      epsilon(elements[ 10 ]) + ',' +
      epsilon(elements[ 11 ]) + ',' +
      epsilon(elements[ 12 ]) + ',' +
      epsilon(elements[ 13 ]) + ',' +
      epsilon(elements[ 14 ]) + ',' +
      epsilon(elements[ 15 ]) +
    ')'

    // if (isIE) {
    //   return 'translate(-50%,-50%)' +
    //     'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)' +
    //     cameraCSSMatrix +
    //     matrix3d
    // }

    // return 'translate(-50%,-50%)' + matrix3d
    // return 'translate(-377.5px,-313.5px)' + matrix3d
    return matrix3d
  }

  function renderObject (object, camera, cameraCSSMatrix) {
    if (object instanceof CSS3DObject) {
      var style

      // if (object instanceof THREE.CSS3DSprite) {
      //   // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

      //   matrix.copy(camera.matrixWorldInverse)
      //   matrix.transpose()
      //   matrix.copyPosition(object.matrixWorld)
      //   matrix.scale(object.scale)

      //   matrix.elements[ 3 ] = 0
      //   matrix.elements[ 7 ] = 0
      //   matrix.elements[ 11 ] = 0
      //   matrix.elements[ 15 ] = 1

      //   style = getObjectCSSMatrix(matrix, cameraCSSMatrix)
      // } else {

      const mCamera = camera.matrixWorldInverse
      const mTranslate = new THREE.Matrix4().setPosition(new THREE.Vector3(_widthHalf, _heightHalf, 0))

      const mObject = object.matrixWorld

      const w = object.element.offsetWidth / 2
      const h = object.element.offsetHeight / 2

      // debugger

      const m50Percent = new THREE.Matrix4().setPosition(new THREE.Vector3(-w, -h, 0))

      const final = new THREE.Matrix4()
      // final.multiply(mCamera)
      final.multiply(mTranslate)
      final.multiply(mObject)
      final.multiply(m50Percent)

      style = getObjectCSSMatrix(final)
      // style = getObjectCSSMatrix(object.matrixWorld)
      // }

      var element = object.element

      window.objectElement = element

      var cachedStyle = cache.objects.get(object)

      if (cachedStyle === undefined || cachedStyle !== style) {
        element.style.WebkitTransform = style
        element.style.transform = style

        var objectData = { style: style }

        if (isIE) {
          objectData.distanceToCameraSquared = getDistanceToSquared(camera, object)
        }

        cache.objects.set(object, objectData)
      }

      if (element.parentNode !== cameraElement) {
        cameraElement.appendChild(element)
      }
    }

    for (var i = 0, l = object.children.length; i < l; i++) {
      renderObject(object.children[ i ], camera, cameraCSSMatrix)
    }
  }

  var getDistanceToSquared = (function () {
    var a = new THREE.Vector3()
    var b = new THREE.Vector3()

    return function (object1, object2) {
      a.setFromMatrixPosition(object1.matrixWorld)
      b.setFromMatrixPosition(object2.matrixWorld)
      return a.distanceToSquared(b)
    }
  }())

  function filterAndFlatten (scene) {
    var result = []

    scene.traverse(function (object) {
      if (object instanceof THREE.CSS3DObject) result.push(object)
    })

    return result
  }

  function zOrder (scene) {
    var sorted = filterAndFlatten(scene).sort(function (a, b) {
      var distanceA = cache.objects.get(a).distanceToCameraSquared
      var distanceB = cache.objects.get(b).distanceToCameraSquared

      return distanceA - distanceB
    })

    var zMax = sorted.length

    for (var i = 0, l = sorted.length; i < l; i++) {
      sorted[ i ].element.style.zIndex = zMax - i
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

    if (camera.isOrthographicCamera) {
      var tx = -(camera.right + camera.left) / 2
      var ty = (camera.top + camera.bottom) / 2
    }

    const mCamera = camera.matrixWorldInverse
    const mZ = new THREE.Matrix4().setPosition(new THREE.Vector3(0, 0, fov))

    const mCameraFinal = new THREE.Matrix4().multiplyMatrices(mZ, mCamera)

    var cameraCSSMatrix = camera.isOrthographicCamera
      ? 'scale(' + fov + ')' + 'translate(' + epsilon(tx) + 'px,' + epsilon(ty) + 'px)' + getCameraCSSMatrix(camera.matrixWorldInverse)
      : getCameraCSSMatrix(mCameraFinal)

    var style = cameraCSSMatrix // +
    // 'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)'

    if (cache.camera.style !== style && !isIE) {
      cameraElement.style.WebkitTransform = style
      cameraElement.style.transform = style

      cache.camera.style = style
    }

    renderObject(scene, camera, cameraCSSMatrix)

    if (isIE) {
      // IE10 and 11 does not support 'preserve-3d'.
      // Thus, z-order in 3D will not work.
      // We have to calc z-order manually and set CSS z-index for IE.
      // FYI: z-index can't handle object intersection
      zOrder(scene)
    }
  }
};

CSS3DRenderer.prototype = Object.create(THREE.EventDispatcher.prototype)
CSS3DRenderer.prototype.constructor = CSS3DRenderer
module.exports.CSS3DRenderer = CSS3DRenderer
