/* global test expect afterEach afterAll jest */

import '@babel/polyfill'

require('dotenv').config()

const getDb = require('../getDb')

jest.mock('../email')

const uniqueTestDbName = () => {
  return 'tenn16_test_' + (Math.random() * 1000).toFixed(0)
}

let db

afterEach(async () => {
  if (db) {
    db.dropDatabase()
    await db.close()
  }
})

// need to give mongoist a moment to close it's
// connections
afterAll(async () => {
  return new Promise(resolve => {
    setTimeout(resolve, 1000)
  })
})

test('no players when the database is initialised', async () => {
  const name = uniqueTestDbName()
  db = getDb(name)
  const players = await db.getPlayers()
  expect(players.length).toBe(0)
})

test('add player', async () => {
  db = getDb(uniqueTestDbName())
  await db.addPlayer('test-player', 'pw', 't@p.w')
  const players = await db.getPlayers()
  expect(players.length).toBe(1)
})

test('add player - set and get is admin', async () => {
  db = getDb(uniqueTestDbName())
  const player = await db.addPlayer('test-player', 'pw', 't@p.w')
  // const players = await db.getPlayers()
  expect(!!player.isAdmin).toBe(false)
  await db.setIsAdmin('test-player', true)
  const isAdmin = await db.getIsAdmin(player._id)
  expect(isAdmin).toBe(true)
  await db.setIsAdmin('test-player', false)
  const isAdmin2 = await db.getIsAdmin(player._id)
  expect(isAdmin2).toBe(false)
})

test('no two players with same name', async () => {
  db = getDb(uniqueTestDbName())
  await db.addPlayer('test-player', 'pw', 't@p.w')
  await db.addPlayer('test-player', 'pw2', 't@p.w2')
  const players = await db.getPlayers()
  expect(players.length).toBe(1)
})

test('get player', async () => {
  db = getDb(uniqueTestDbName())
  await db.addPlayer('test-player', 'pw', 't@p.w')
  const player = await db.getPlayer({ name: 'test-player' })
  expect(player.name).toBe('test-player')
})

test('authenticate', async () => {
  db = getDb(uniqueTestDbName())
  const player = await db.addPlayer('test-player', 'pw', 't@p.w')
  const result = await db.authenticate('test-player', 'pw')
  expect(result).toBe(player._id.toString())
})

test('authenticate wrong password', async () => {
  db = getDb(uniqueTestDbName())
  await db.addPlayer('test-player', 'pw', 't@p.w')
  const result = await db.authenticate('test-player', 'wrong password')
  expect(result).toBe(false)
})

test('change password', async () => {
  db = getDb(uniqueTestDbName())
  const player = await db.addPlayer('test-player', 'pw', 't@p.w')
  const changed = await db.changePassword(
    player._id.toString(),
    'pw',
    'new password'
  )
  const result = await db.authenticate('test-player', 'new password')
  expect(changed).toBe(true)
  expect(result).toBe(player._id.toString())
})

test('change password wrong old password', async () => {
  db = getDb(uniqueTestDbName())
  const player = await db.addPlayer('test-player', 'pw', 't@p.w')
  const changed = await db.changePassword(
    player._id.toString(),
    'wrong password',
    'new password'
  )
  const result = await db.authenticate('test-player', 'pw')
  expect(changed).toBe(false)
  expect(result).toBe(player._id.toString())
})

test('setPassword', async () => {
  db = getDb(uniqueTestDbName())
  const player = await db.addPlayer('test-player', 'pw', 't@p.w')
  await db.setPassword('test-player', 'pw2')
  const result = await db.authenticate('test-player', 'pw2')
  expect(result).toBe(player._id.toString())
})

// test('add two players and check that one is moved down', async () => {
//   db = getDb(uniqueTestDbName())
//   await db.addPlayer('player-1', 'pw', 't@p.w')
//   await db.addPlayer('player-2', 'pw', 't@p.w')
//   const player1 = await db.getPlayer({ name: 'player-1' })
//   expect(player1.ladderPosition).toBe(2)
// })

// test('move to position', async () => {
//   db = getDb(uniqueTestDbName())
//   await db.addPlayer('player-1', 'pw', 't@p.w')
//   await db.addPlayer('player-2', 'pw', 't@p.w')
//   const player1 = await db.getPlayer({ name: 'player-1' })
//   // expect(player1.ladderPosition).toBe(2)
//   await db.moveToSinglesPosition({ name: 'player-1' }, 1)
//   const player1Moved = await db.getPlayer({ name: 'player-1' })
//   expect(player1Moved.ladderPosition).toBe(1)
//   const player2 = await db.getPlayer({ name: 'player-2' })
//   expect(player2.ladderPosition).toBe(2)
// })

test('getSinglesMatches', async () => {
  db = getDb(uniqueTestDbName())
  const matches = await db.getSinglesMatches()
  expect(matches.length).toBe(0)
})

test('addSinglesMatch', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
  const match = {
    sideA: player1._id,
    sideB: player2._id,
    score: [[6, 4]]
  }
  await db.addSinglesMatch(match)
  const matches = await db.getSinglesMatches()
  expect(matches.length).toBe(1)
})

test('addSinglesMatch - add two matches', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
  const player3 = await db.addPlayer('player-3', 'pw', 't@p.w')
  const player4 = await db.addPlayer('player-4', 'pw', 't@p.w')
  const match = {
    sideA: player1._id,
    sideB: player2._id,
    score: [[6, 4]]
  }
  await db.addSinglesMatch(match)
  const match2 = {
    sideA: player3._id,
    sideB: player4._id,
    score: [[6, 4]]
  }
  const match2AfterSave = await db.addSinglesMatch(match2)
  const matches = await db.getSinglesMatches()
  expect(matches.length).toBe(2)
  expect(match2AfterSave.ladderAfterMatch.length).toBe(4)
})

test('addSinglesMatch - disappear after time elapsed', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const day = 1000 * 60 * 60 * 24
  const lookback = process.env.DAYS_SINCE_PLAYED_CUTOFF_SINGLES * day

  const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
  const player3 = await db.addPlayer('player-3', 'pw', 't@p.w')
  const player4 = await db.addPlayer('player-4', 'pw', 't@p.w')
  const match = {
    sideA: player1._id,
    sideB: player2._id,
    score: [[6, 4]],
    date: new Date().getTime() - lookback
  }
  await db.addSinglesMatch(match)
  const match2 = {
    sideA: player3._id,
    sideB: player4._id,
    score: [[6, 4]]
  }
  const match2AfterSave = await db.addSinglesMatch(match2)
  const matches = await db.getSinglesMatches()
  expect(matches.length).toBe(2)
  expect(match2AfterSave.ladderAfterMatch.length).toBe(2)
})

test('addSinglesMatch - ladder after match when player 1 wins', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
  const match = {
    sideA: player1._id,
    sideB: player2._id,
    score: [[6, 4]]
  }
  const savedMatch = await db.addSinglesMatch(match)
  expect(savedMatch.ladderAfterMatch).toEqual([player1._id, player2._id])
})

test('addSinglesMatch - ladder after match when player 2 wins', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
  const match = {
    sideA: player1._id,
    sideB: player2._id,
    score: [[4, 6]]
  }
  const savedMatch = await db.addSinglesMatch(match)
  expect(savedMatch.ladderAfterMatch).toEqual([player2._id, player1._id])
})

test('addSinglesMatch - ranking change', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
  const match = {
    sideA: player1._id,
    sideB: player2._id,
    score: [[4, 6]]
  }
  await db.addSinglesMatch(match)
  const player1AfterLosing = await db.getPlayer({ name: 'player-1' })
  const player2AfterWinning = await db.getPlayer({ name: 'player-2' })
  expect(player1AfterLosing.singlesRating).toBe(1184)
  expect(player2AfterWinning.singlesRating).toBe(1216)
})

test('addSinglesMatch - recorded by', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
  const match = {
    recordedBy: player1._id,
    sideA: player1._id,
    sideB: player2._id,
    score: [[4, 6]]
  }
  const savedMatch = await db.addSinglesMatch(match)
  expect(savedMatch.recordedBy).toEqual(player1._id)
})

test('addSinglesMatch - loser is new', async () => {
  db = getDb(uniqueTestDbName())
  const p1 = await db.addPlayer('p1', 'pw', 'l@l.c')
  const p2 = await db.addPlayer('p2', 'pw', 't@p.w')
  const p3 = await db.addPlayer('p3', 'pw', 't@p.w')

  await db.addSinglesMatch({ sideA: p1._id, sideB: p2._id, score: [[6, 4]] })

  const match = {
    sideA: p1._id,
    sideB: p3._id,
    score: [[6, 4]]
  }
  const savedMatch2 = await db.addSinglesMatch(match)

  expect(savedMatch2.ladderAfterMatch).toEqual([p1._id, p3._id, p2._id])
})

test('addSinglesMatch - winner is new', async () => {
  db = getDb(uniqueTestDbName())
  const p1 = await db.addPlayer('p1', 'pw', 'l@l.c')
  const p2 = await db.addPlayer('p2', 'pw', 't@p.w')
  const p3 = await db.addPlayer('p3', 'pw', 't@p.w')

  await db.addSinglesMatch({ sideA: p1._id, sideB: p2._id, score: [[4, 6]] })

  const match = {
    sideA: p1._id,
    sideB: p3._id,
    score: [[4, 6]]
  }
  const savedMatch2 = await db.addSinglesMatch(match)

  expect(savedMatch2.ladderAfterMatch).toEqual([p2._id, p3._id, p1._id])
})

test('addSinglesMatch - winner moves up', async () => {
  db = getDb(uniqueTestDbName())
  const p1 = await db.addPlayer('p1', 'pw', 'l@l.c')
  const p2 = await db.addPlayer('p2', 'pw', 't@p.w')

  const savedMatch1 = await db.addSinglesMatch({
    sideA: p1._id,
    sideB: p2._id,
    score: [[6, 4]]
  })

  const savedMatch2 = await db.addSinglesMatch({
    sideA: p1._id,
    sideB: p2._id,
    score: [[4, 6]]
  })

  expect(savedMatch1.ladderAfterMatch).toEqual([p1._id, p2._id])
  expect(savedMatch2.ladderAfterMatch).toEqual([p2._id, p1._id])
})

test('addSinglesMatch - no change', async () => {
  db = getDb(uniqueTestDbName())
  const p1 = await db.addPlayer('p1', 'pw', 'l@l.c')
  const p2 = await db.addPlayer('p2', 'pw', 't@p.w')

  const savedMatch1 = await db.addSinglesMatch({
    sideA: p1._id,
    sideB: p2._id,
    score: [[6, 4]]
  })

  const savedMatch2 = await db.addSinglesMatch({
    sideA: p1._id,
    sideB: p2._id,
    score: [[6, 4]]
  })

  expect(savedMatch1.ladderAfterMatch).toEqual(savedMatch2.ladderAfterMatch)
})

test('addSinglesMatch - entering ladder on a draw', async () => {
  db = getDb(uniqueTestDbName())
  const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
  const match = {
    sideA: player1._id,
    sideB: player2._id,
    score: [
      [4, 6],
      [6, 4]
    ]
  }
  const savedMatch = await db.addSinglesMatch(match)
  expect(savedMatch.ladderAfterMatch).toEqual([player1._id, player2._id])
})

test('addSinglesMatch - entering ladder on a draw with Luke in ladder', async () => {
  db = getDb(uniqueTestDbName())
  const luke = await db.addPlayer('Luke', 'pw', 'l@l.c')
  const p1 = await db.addPlayer('p1', 'pw', 't@p.w')
  const p2 = await db.addPlayer('p2', 'pw', 't@p.w')
  const p3 = await db.addPlayer('p3', 'pw', 't@p.w')

  await db.addSinglesMatch({
    sideA: luke._id,
    sideB: p1._id,
    score: [[6, 4]]
  })

  const savedMatch2 = await db.addSinglesMatch({
    sideA: p1._id,
    sideB: p2._id,
    score: [
      [4, 6],
      [6, 4]
    ]
  })

  expect(savedMatch2.ladderAfterMatch).toEqual([
    p2._id,
    luke._id,
    p1._id
  ])

  const savedMatch3 = await db.addSinglesMatch({
    sideA: p3._id,
    sideB: p2._id,
    score: [
      [4, 6],
      [6, 4]
    ]
  })

  expect(savedMatch3.ladderAfterMatch).toEqual([
    p2._id,
    p3._id,
    luke._id,
    p1._id
  ])
})

test('addDoublesMatch', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
  const player3 = await db.addPlayer('player-3', 'pw', 't@p.w')
  const player4 = await db.addPlayer('player-4', 'pw', 't@p.w')
  const match = {
    sideA: [player1._id, player2._id],
    sideB: [player3._id, player4._id],
    score: [[6, 4]]
  }
  await db.addDoublesMatch(match)
  const matches = await db.getDoublesMatches()
  expect(matches.length).toBe(1)
})

test('addDoublesMatch - no winner', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
  const player3 = await db.addPlayer('player-3', 'pw', 't@p.w')
  const player4 = await db.addPlayer('player-4', 'pw', 't@p.w')
  const match = {
    sideA: [player1._id, player2._id],
    sideB: [player3._id, player4._id],
    score: [
      [6, 4],
      [4, 6]
    ]
  }
  await db.addDoublesMatch(match)
  const matches = await db.getDoublesMatches()
  expect(matches.length).toBe(1)
})

test('addDoublesMatch - check ratings changes', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
  const player3 = await db.addPlayer('player-3', 'pw', 't@p.w')
  const player4 = await db.addPlayer('player-4', 'pw', 't@p.w')
  const match = {
    sideA: [player1._id, player2._id],
    sideB: [player3._id, player4._id],
    score: [[6, 4]]
  }
  await db.addDoublesMatch(match)
  const player1AfterWinning = await db.getPlayer({ name: 'player-1' })
  const player2AfterWinning = await db.getPlayer({ name: 'player-2' })
  const player3AfterLosing = await db.getPlayer({ name: 'player-3' })
  const player4AfterLosing = await db.getPlayer({ name: 'player-4' })
  expect(player1AfterWinning.doublesRating).toBe(1216)
  expect(player2AfterWinning.doublesRating).toBe(1216)
  expect(player3AfterLosing.doublesRating).toBe(1184)
  expect(player4AfterLosing.doublesRating).toBe(1184)
})

// test('addDoublesMatch - mismatched teams', async () => {
//   const dbName = uniqueTestDbName()
//   db = getDb(dbName)
//   const player1 = await db.addPlayer('player-1', 'pw', 't@p.w', { doublesRating: 1200 })
//   const player2 = await db.addPlayer('player-2', 'pw', 't@p.w', { doublesRating: 800 })
//   const player3 = await db.addPlayer('player-3', 'pw', 't@p.w', { doublesRating: 1200 })
//   const player4 = await db.addPlayer('player-4', 'pw', 't@p.w', { doublesRating: 1200 })
//   const match = {
//     sideA: [player1._id, player2._id],
//     sideB: [player3._id, player4._id],
//     score: [[6, 4]]
//   }
//   await db.addDoublesMatch(match)
//   const player1AfterWinning = await db.getPlayer({ name: 'player-1' })
//   const player2AfterWinning = await db.getPlayer({ name: 'player-2' })
//   const player3AfterLosing = await db.getPlayer({ name: 'player-3' })
//   const player4AfterLosing = await db.getPlayer({ name: 'player-4' })
//   expect(player1AfterWinning.doublesRating).toBe(1224)
//   expect(player2AfterWinning.doublesRating).toBe(824)
//   expect(player3AfterLosing.doublesRating).toBe(1176)
//   expect(player4AfterLosing.doublesRating).toBe(1176)
// })

// test('addSinglesChallenge', async () => {
//   db = getDb(uniqueTestDbName())
//   const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
//   const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
//   const challenge = {
//     challenger: player1._id,
//     challenged: player2._id
//   }
//   await db.addSinglesChallenge(challenge)
// })

// test('getOutstandingSinglesChallenges', async () => {
//   db = getDb(uniqueTestDbName())
//   const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
//   const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
//   const player3 = await db.addPlayer('player-3', 'pw', 't@p.w')
//   await db.addSinglesChallenge({
//     challenger: player1._id,
//     challenged: player2._id
//   })
//   await db.addSinglesChallenge({
//     challenger: player1._id,
//     challenged: player3._id
//   })
//   const challenges = await db.getOutstandingSinglesChallenges()
//   expect(challenges.length).toBe(2)
// })

// test('resolve challenge when adding match', async () => {
//   db = getDb(uniqueTestDbName())
//   const player1 = await db.addPlayer('player-1', 'pw', 't@p.w')
//   const player2 = await db.addPlayer('player-2', 'pw', 't@p.w')
//   const player3 = await db.addPlayer('player-3', 'pw', 't@p.w')
//   await db.addSinglesChallenge({
//     challenger: player1._id,
//     challenged: player2._id
//   })
//   await db.addSinglesChallenge({
//     challenger: player1._id,
//     challenged: player3._id
//   })
//   const match = {
//     sideA: player1._id,
//     sideB: player2._id,
//     score: [[4, 6], [6, 4]]
//   }
//   await db.addSinglesMatch(match)
//   const challenges = await db.getOutstandingSinglesChallenges()
//   expect(challenges.length).toBe(1)
// })
