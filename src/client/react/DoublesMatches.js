// import React from 'react'

// export default class SinglesMatches extends React.Component {
//   constructor () {
//     super()
//     this.showNewMatchModal = this.showNewMatchModal.bind(this)
//     this.closeNewMatchModal = this.closeNewMatchModal.bind(this)
//     this.state = {
//       showNewMatchModal: false
//     }
//   }

//   showNewMatchModal () {
//     this.setState({ showNewMatchModal: true })
//   }

//   closeNewMatchModal () {
//     this.setState({ showNewMatchModal: false })
//   }
  
//   render () {
//     if (!this.props.matches) {
//       return 'loading...'
//     } else {
//       return <span>
//         {
//           this.props.userId && <>
//             <a className='button' onClick={this.showNewMatchModal}>record a match</a>
//             <br />
//           </>
//         }
//         <br />
//         <Matches matches={this.props.matches} players={this.props.players} />
//         <NewMatchModal
//           userId={this.props.userId}
//           players={this.props.players}
//           show={this.state.showNewMatchModal}
//           onClose={this.closeNewMatchModal}
//           onAddMatch={this.props.onAddMatch}
//         />
//       </span>
//     }
//   }
// }
