import 'babel-core/register'

import Y from 'yjs'
import YMap from 'y-map'
import YArray from 'y-array'

import getProxyForYObject from './getProxyForYObject'

async function extend (Y) {
  await Y.requestModules(['Array', 'Map'])
  console.log(Y.Map, Y.Array)
  Y.PlainState = function (state) {
    return getProxyForYObject(state)
  }
}

import setDefaults from './setDefaults'

export default extend
export { setDefaults }