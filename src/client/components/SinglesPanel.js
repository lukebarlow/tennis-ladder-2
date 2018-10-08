import React from 'react'
import SinglesLadder from './SinglesLadder'
import SinglesMatches from './SinglesMatches'

export default ({ userId }) => (
  <table width='100%'>
    <tbody>
      <tr>
        <td width='50%'>
          <h1>singles</h1>
          <br />
          <SinglesLadder userId={userId} />
        </td>
        <td width='50%'>
          <h1>recent matches</h1>
          <SinglesMatches userId={userId} />
        </td>
      </tr>
    </tbody>
  </table>
)
