import React from 'react'
import SinglesLadder from './SinglesLadder'
import SinglesMatches from './SinglesMatches'

export default () => (
  <table width='100%'>
    <tbody>
      <tr>
        <td width='50%'>
          <h1>singles</h1>
          <br />
          <SinglesLadder />
        </td>
        <td width='50%'>
          <h1>recent matches</h1>
          <SinglesMatches />
        </td>
      </tr>
    </tbody>
  </table>
)
