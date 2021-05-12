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
    ...panelPositionAndRotation(RADIUS, 45, 15),
    component: SinglesPanel
  },
  doubles: {
    ...panelPositionAndRotation(RADIUS, 165, 15),
    component: DoublesPanel
  },
  tom: {
    // position: [0.1, 512, 0.1],
    // rotation: [-Math.PI / 2, 0, Math.PI * 5 / 4],
    ...panelPositionAndRotation(RADIUS, 280, 50),
    component: TomPanel
  },
  // settings: {
  //   position: [0, -512, 0.1],
  //   rotation: [Math.PI / 2, 0, Math.PI],
  //   component: SettingsPanel,
  //   visibleIf: ({ userId }) => userId
  // },
  // admin: {
  //   position: [0, 0, 512],
  //   rotation: [0, Math.PI, 0],
  //   component: AdminPanel,
  //   visibleIf: ({ isAdmin }) => isAdmin
  // }
}
