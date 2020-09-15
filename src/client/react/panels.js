import SinglesPanel from './SinglesPanel'
import DoublesPanel from './DoublesPanel'
import TomPanel from './TomPanel'
import SettingsPanel from './SettingsPanel'
import AdminPanel from './AdminPanel'

export default {
  singles: {
    position: [-512, 0, 0],
    rotation: [0, Math.PI / 2, 0],
    component: SinglesPanel
  },
  doubles: {
    position: [512, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
    component: DoublesPanel
  },
  tom: {
    position: [0.1, -512, 0.1],
    rotation: [-Math.PI / 2, 0, Math.PI * 5 / 4],
    component: TomPanel
  },
  settings: {
    position: [0, 512, 0.1],
    rotation: [Math.PI / 2, 0, Math.PI],
    component: SettingsPanel,
    visibleIf: ({ userId }) => userId
  },
  admin: {
    position: [0, 0, 512],
    rotation: [0, Math.PI, 0],
    component: AdminPanel,
    visibleIf: ({ isAdmin }) => isAdmin
  }
}
