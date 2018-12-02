import SinglesPanel from './SinglesPanel'
import DoublesPanel from './DoublesPanel'
import SettingsPanel from './SettingsPanel'

export default {
  singles: {
    position: [ 0, 0, -512 ],
    rotation: [ 0, 0, 0 ],
    component: SinglesPanel
  }
  // doubles: {
  //   position: [ -50, 0, -512 ],
  //   rotation: [ 0, 45 / 180 * Math.PI, 0 ],
  //   component: DoublesPanel
  // }
  // settings: {
  //   position: [ 0, 512, 0.1 ],
  //   rotation: [ Math.PI / 2, 0, Math.PI ],
  //   component: SettingsPanel
  // }
}
