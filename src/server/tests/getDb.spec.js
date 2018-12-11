/* global test expect afterEach afterAll jest */

const getDb = require('../getDb')

jest.mock('../email')

const uniqueTestDbName = () => {
  return 'tenn16_test_' + (Math.random() * 1000).toFixed(0)
}

let db

afterEach(async () => {
  db.dropDatabase()
  await db.close()
})

// need to give mongoist a moment to close it's
// connections
afterAll(async () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
})

test('no players when the database is initialised', async () => {
  db = getDb(uniqueTestDbName())
  const players = await db.getPlayers()
  expect(players.length).toBe(0)
})

test('add player', async () => {
  db = getDb(uniqueTestDbName())
  await db.addPlayer('test-player', 'pw', 1, 't@p.w')
  const players = await db.getPlayers()
  expect(players.length).toBe(1)
})

test('no two players with same name', async () => {
  db = getDb(uniqueTestDbName())
  await db.addPlayer('test-player', 'pw', 1, 't@p.w')
  await db.addPlayer('test-player', 'pw2', 2, 't@p.w2')
  const players = await db.getPlayers()
  expect(players.length).toBe(1)
})

test('get player', async () => {
  db = getDb(uniqueTestDbName())
  await db.addPlayer('test-player', 'pw', 1, 't@p.w')
  const player = await db.getPlayer({ name: 'test-player' })
  expect(player.name).toBe('test-player')
  expect(player.ladderPosition).toBe(1)
})

test('authenticate', async () => {
  db = getDb(uniqueTestDbName())
  const player = await db.addPlayer('test-player', 'pw', 1, 't@p.w')
  const result = await db.authenticate('test-player', 'pw')
  expect(result).toBe(player._id.toString())
})

test('authenticate wrong password', async () => {
  db = getDb(uniqueTestDbName())
  await db.addPlayer('test-player', 'pw', 1, 't@p.w')
  const result = await db.authenticate('test-player', 'wrong password')
  expect(result).toBe(false)
})

test('change password', async () => {
  db = getDb(uniqueTestDbName())
  const player = await db.addPlayer('test-player', 'pw', 1, 't@p.w')
  const changed = await db.changePassword(player._id.toString(), 'pw', 'new password')
  const result = await db.authenticate('test-player', 'new password')
  expect(changed).toBe(true)
  expect(result).toBe(player._id.toString())
})

test('change password wrong old password', async () => {
  db = getDb(uniqueTestDbName())
  const player = await db.addPlayer('test-player', 'pw', 1, 't@p.w')
  const changed = await db.changePassword(player._id.toString(), 'wrong password', 'new password')
  const result = await db.authenticate('test-player', 'pw')
  expect(changed).toBe(false)
  expect(result).toBe(player._id.toString())
})

test('setPassword', async () => {
  db = getDb(uniqueTestDbName())
  const player = await db.addPlayer('test-player', 'pw', 1, 't@p.w')
  await db.setPassword('test-player', 'pw2')
  const result = await db.authenticate('test-player', 'pw2')
  expect(result).toBe(player._id.toString())
})

test('add two players and check that one is moved down', async () => {
  db = getDb(uniqueTestDbName())
  await db.addPlayer('player-1', 'pw', 1, 't@p.w')
  await db.addPlayer('player-2', 'pw', 1, 't@p.w')
  const player1 = await db.getPlayer({ name: 'player-1' })
  expect(player1.ladderPosition).toBe(2)
})

test('move to position', async () => {
  db = getDb(uniqueTestDbName())
  await db.addPlayer('player-1', 'pw', 1, 't@p.w')
  await db.addPlayer('player-2', 'pw', 1, 't@p.w')
  const player1 = await db.getPlayer({ name: 'player-1' })
  expect(player1.ladderPosition).toBe(2)
  await db.moveToSinglesPosition({ name: 'player-1' }, 1)
  const player1Moved = await db.getPlayer({ name: 'player-1' })
  expect(player1Moved.ladderPosition).toBe(1)
  const player2 = await db.getPlayer({ name: 'player-2' })
  expect(player2.ladderPosition).toBe(2)
})

test('getRecentSinglesMatches', async () => {
  db = getDb(uniqueTestDbName())
  const matches = await db.getRecentSinglesMatches()
  expect(matches.length).toBe(0)
})

test('addSinglesMatch', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 1, 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 2, 't@p.w')
  const match = {
    sideA: player1._id,
    sideB: player2._id,
    score: [[6, 4]]
  }
  await db.addSinglesMatch(match)
  const matches = await db.getRecentSinglesMatches()
  expect(matches.length).toBe(1)
})

test('addSinglesMatch - win position', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 1, 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 2, 't@p.w')
  const match = {
    sideA: player1._id,
    sideB: player2._id,
    score: [[4, 6]]
  }
  await db.addSinglesMatch(match)
  const player2AfterWinning = await db.getPlayer({ name: 'player-2' })
  expect(player2AfterWinning.ladderPosition).toBe(1)
})

test('addSinglesMatch - ranking change', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 1, 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 2, 't@p.w')
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

test('addSinglesMatch - no ladder movement on draw', async () => {
  db = getDb(uniqueTestDbName())
  const player1 = await db.addPlayer('player-1', 'pw', 1, 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 2, 't@p.w')
  const match = {
    sideA: player1._id,
    sideB: player2._id,
    score: [[4, 6], [6, 4]]
  }
  await db.addSinglesMatch(match)
  // const player2AfterWinning = await db.getPlayer({ name: 'player-2' })
  // expect(player2AfterWinning.ladderPosition).toBe(2)
})

test('addDoublesMatch', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 1, 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 2, 't@p.w')
  const player3 = await db.addPlayer('player-3', 'pw', 1, 't@p.w')
  const player4 = await db.addPlayer('player-4', 'pw', 2, 't@p.w')
  const match = {
    sideA: [ player1._id, player2._id ],
    sideB: [ player3._id, player4._id ],
    score: [[6, 4]]
  }
  await db.addDoublesMatch(match)
  const matches = await db.getRecentDoublesMatches()
  expect(matches.length).toBe(1)
})

test('addDoublesMatch - check ratings changes', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 1, 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 2, 't@p.w')
  const player3 = await db.addPlayer('player-3', 'pw', 1, 't@p.w')
  const player4 = await db.addPlayer('player-4', 'pw', 2, 't@p.w')
  const match = {
    sideA: [ player1._id, player2._id ],
    sideB: [ player3._id, player4._id ],
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

test('addDoublesMatch - mismatched teams', async () => {
  const dbName = uniqueTestDbName()
  db = getDb(dbName)
  const player1 = await db.addPlayer('player-1', 'pw', 1, 't@p.w', { doublesRating: 1200 })
  const player2 = await db.addPlayer('player-2', 'pw', 2, 't@p.w', { doublesRating: 800 })
  const player3 = await db.addPlayer('player-3', 'pw', 1, 't@p.w', { doublesRating: 1200 })
  const player4 = await db.addPlayer('player-4', 'pw', 2, 't@p.w', { doublesRating: 1200 })
  const match = {
    sideA: [ player1._id, player2._id ],
    sideB: [ player3._id, player4._id ],
    score: [[6, 4]]
  }
  await db.addDoublesMatch(match)
  const player1AfterWinning = await db.getPlayer({ name: 'player-1' })
  const player2AfterWinning = await db.getPlayer({ name: 'player-2' })
  const player3AfterLosing = await db.getPlayer({ name: 'player-3' })
  const player4AfterLosing = await db.getPlayer({ name: 'player-4' })
  expect(player1AfterWinning.doublesRating).toBe(1224)
  expect(player2AfterWinning.doublesRating).toBe(824)
  expect(player3AfterLosing.doublesRating).toBe(1176)
  expect(player4AfterLosing.doublesRating).toBe(1176)
})

test('addSinglesChallenge', async () => {
  db = getDb(uniqueTestDbName())
  const player1 = await db.addPlayer('player-1', 'pw', 1, 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 2, 't@p.w')
  const challenge = {
    challenger: player1._id,
    challenged: player2._id
  }
  await db.addSinglesChallenge(challenge)
})

test('getOutstandingSinglesChallenges', async () => {
  db = getDb(uniqueTestDbName())
  const player1 = await db.addPlayer('player-1', 'pw', 1, 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 2, 't@p.w')
  const player3 = await db.addPlayer('player-3', 'pw', 2, 't@p.w')
  await db.addSinglesChallenge({
    challenger: player1._id,
    challenged: player2._id
  })
  await db.addSinglesChallenge({
    challenger: player1._id,
    challenged: player3._id
  })
  const challenges = await db.getOutstandingSinglesChallenges()
  expect(challenges.length).toBe(2)
})

test('resolve challenge when adding match', async () => {
  db = getDb(uniqueTestDbName())
  const player1 = await db.addPlayer('player-1', 'pw', 1, 't@p.w')
  const player2 = await db.addPlayer('player-2', 'pw', 2, 't@p.w')
  const player3 = await db.addPlayer('player-3', 'pw', 2, 't@p.w')
  await db.addSinglesChallenge({
    challenger: player1._id,
    challenged: player2._id
  })
  await db.addSinglesChallenge({
    challenger: player1._id,
    challenged: player3._id
  })
  const match = {
    sideA: player1._id,
    sideB: player2._id,
    score: [[4, 6], [6, 4]]
  }
  await db.addSinglesMatch(match)
  const challenges = await db.getOutstandingSinglesChallenges()
  expect(challenges.length).toBe(1)
})
