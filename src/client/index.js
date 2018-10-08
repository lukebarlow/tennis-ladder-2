import React from 'react'
import { render } from 'react-dom'
// import { fetchText } from './fetchHelpers'

import App from './components/App'

// import TopLinks from './components/TopLinks'
// import Navigation from './navigation'
// import CssScene from './css3d/'
// import PanoramaScene from './panorama/'

// window.CssScene = CssScene

// Navigation.setScenes([CssScene, PanoramaScene])

// let userId = null

// function loginHandler (_userId) {
//   userId = _userId
//   updateNavigation()
//   renderTopLinks()
// }

// function logoutHandler () {
//   userId = null
//   updateNavigation()
//   renderTopLinks()
// }

// function updateNavigation () {
//   CssScene.userId(userId).update()
// }

// function renderTopLinks () {
//   render(<TopLinks
//     navigator={Navigation}
//     onLogin={loginHandler}
//     onLogout={logoutHandler}
//     userId={userId} />, document.getElementById('top-links'))
// }

// async function init () {
//   userId = await fetchText('./userId')
//   console.log('userId', userId)
//   renderTopLinks()
// }

// init()

  render(<App />, document.getElementById('main'))