import React from 'react'
import { render } from 'react-dom'

import Ladder from './components/Ladder'

async function fetchJson(url) {
  const response = await fetch(url)
  return await response.json()
}

function draw(rungs) {
  render(
    <Ladder rungs={rungs} />,
    document.getElementById('main')
  )
}

async function init() {
  const rungs = await fetchJson('./ladder')
  draw(rungs)
}

init()