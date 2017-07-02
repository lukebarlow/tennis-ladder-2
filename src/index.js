import YPlainState from './y-plain-state/index'

import Y from 'yjs'
import YMap from 'y-map'
import YArray from 'y-array'
import YWebsocketsClient from 'y-websockets-client'
import YMemory from 'y-memory'

Y.extend(YMap, YArray, YWebsocketsClient, YMemory, YPlainState)

function draw (state) {
  var data = document.getElementById('data')
  data.innerHTML = JSON.stringify(state, null, 2)
}

Y({
  db: {
    name: 'memory'
  },
  connector: {
    name: 'websockets-client',
    room: 'y-plain-state-examples-basic',
    url: `http://${window.location.hostname}:${window.location.port}`
  },
  share: { state: 'Map' }
}).then((y) => {
  const state = Y.PlainState(y.share.state)
  window.state = state // for debugging convenience
  draw(state)
  state.on('change', () => {
    draw(state)
  })
})
