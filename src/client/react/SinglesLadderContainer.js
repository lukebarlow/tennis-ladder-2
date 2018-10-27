// import React from 'react'
// import Ladder from './Ladder'

// async function fetchJson (url) {
//   const response = await fetch(url)
//   return await response.json()
// }

// export default class SinglesLadderContainer extends React.Component {
//   constructor () {
//     super()
//     this.state = {
//       loading: true,
//       rungs: []
//     }
//     this._load()
//   }

//   async _load () {
//     const rungs = await fetchJson('./ladder')
//     this.setState({
//       loading: false,
//       rungs: rungs
//     })
//   }

//   render () {
//     if (this.state.loading) {
//       return 'loading...'
//     } else {
//       return <table width='100%'>
//         <tbody>
//           <tr>
//             <td width='50%'>
//               <h1>singles</h1>
//               <Ladder rungs={this.state.rungs} />
//             </td>
//             <td width='50%'>
//               <h1>recent matches</h1>

//             </td>
//           </tr>
//         </tbody>
//       </table>
//     }
//   }
// }
