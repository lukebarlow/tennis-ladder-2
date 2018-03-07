import React from 'react'
import { render } from 'react-dom'

import CssScene from './css3d/'
import PanoramaScene from './panorama/'
import Navigation from './navigation'

import TopLinks from './components/TopLinks'

Navigation.setScenes([CssScene, PanoramaScene])

render(<TopLinks navigator={Navigation} />, document.getElementById('top-links'))
