import React from 'react'

import range from '../range'

export default function ({ onChange, value }) {
  return <select onChange={onChange} value={value}>
    <option />
    { range(8).map((i) => <option key={i} value={i}>{i}</option>) }
  </select>
}
