import SinglesPanel from './SinglesPanel'
import DoublesPanel from './DoublesPanel'
import TomPanel from './TomPanel'
import SettingsPanel from './SettingsPanel'
import AdminPanel from './AdminPanel'
import { Spherical, Vector3, Math as ThreeMath } from 'three'

const Pi = Math.PI
const RADIUS = 512

function panelPositionAndRotation (radius, around, up) {
  const upRad = ThreeMath.degToRad( up )
  const phi = Pi / 2 - upRad
  const theta = ThreeMath.degToRad( around )
  const spherical = new Spherical(radius, phi, theta)
  const v = new Vector3().setFromSpherical(spherical)
  return {
    position: [v.x, v.y, v.z],
    rotation: [upRad, theta + Pi, 0]
  }
}

export default {
  singles: {
    ...panelPositionAndRotation(RADIUS, 35, 2),
    component: SinglesPanel
  },
  doubles: {
    ...panelPositionAndRotation(RADIUS, 165, 15),
    component: DoublesPanel
  },
  tom: {
    ...panelPositionAndRotation(RADIUS, 280, 65),
    component: TomPanel
  },
  settings: {
    ...panelPositionAndRotation(RADIUS, -90, -11),
    component: SettingsPanel,
    visibleIf: ({ userId }) => userId
  },
  admin: {
    ...panelPositionAndRotation(RADIUS, 0, -89),
    component: AdminPanel,
    visibleIf: ({ isAdmin }) => isAdmin
  }
}
