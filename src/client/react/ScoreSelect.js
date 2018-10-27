import React from 'react'

import range from '../range'

export default function ({ onChange }) {
  return <select onChange={onChange}>
    <option></option>
    { range(8).map((i) => <option key={i} value={i}>{i}</option>) }
  </select>
}