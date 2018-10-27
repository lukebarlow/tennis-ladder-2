import React from 'react'
import DoublesLadder from './DoublesLadder'
import DoublesMatches from './DoublesMatches'

export default () => (
  <table width='100%'>
    <tbody>
      <tr>
        <td width='50%'>
          <h1>singles</h1>
          <br />
          <DoublesLadder />
        </td>
        <td width='50%'>
          <h1>recent matches</h1>
          <DoublesMatches />
        </td>
      </tr>
    </tbody>
  </table>
)
