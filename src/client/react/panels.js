import SinglesPanel from './SinglesPanel'
import DoublesPanel from './DoublesPanel'
import SettingsPanel from './SettingsPanel'

export default {
  singles: {
    position: [ -512, 0, 0 ],
    rotation: [ 0, Math.PI / 2, 0 ],
    component: SinglesPanel
  },
  doubles: {
    position: [ 512, 0, 0 ],
    rotation: [ 0, -Math.PI / 2, 0 ],
    component: DoublesPanel
  },
  settings: {
    position: [ 0, -512, 0.1 ],
    rotation: [ -Math.PI / 2, 0, Math.PI ],
    component: SettingsPanel
  }
}
