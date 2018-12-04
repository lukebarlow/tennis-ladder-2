/* global test expect */

import matchWinnerAndLoser from '../matchWinnerAndLoser'

test('a wins', () => {
  const match = {
    sideA: 'a',
    sideB: 'b',
    score: [[6, 4]]
  }
  const { winner, loser } = matchWinnerAndLoser(match)
  expect(winner).toBe('a')
  expect(loser).toBe('b')
})

test('b wins', () => {
  const match = {
    sideA: 'a',
    sideB: 'b',
    score: [[2, 6]]
  }
  const { winner, loser } = matchWinnerAndLoser(match)
  expect(winner).toBe('b')
  expect(loser).toBe('a')
})

test('tie break', () => {
  const match = {
    sideA: 'a',
    sideB: 'b',
    score: [[6, 7, [4, 7]]]
  }
  const { winner, loser } = matchWinnerAndLoser(match)
  expect(winner).toBe('b')
  expect(loser).toBe('a')
})

test('three sets', () => {
  const match = {
    sideA: 'a',
    sideB: 'b',
    score: [[6, 4], [4, 6], [4, 6]]
  }
  const { winner, loser } = matchWinnerAndLoser(match)
  expect(winner).toBe('b')
  expect(loser).toBe('a')
})

test('two sets draw', () => {
  const match = {
    sideA: 'a',
    sideB: 'b',
    score: [[6, 4], [4, 6]]
  }
  const { winner, loser } = matchWinnerAndLoser(match)
  expect(winner).toBe(null)
  expect(loser).toBe(null)
})

test('two sets win', () => {
  const match = {
    sideA: 'a',
    sideB: 'b',
    score: [[6, 4], [6, 2]]
  }
  const { winner, loser } = matchWinnerAndLoser(match)
  expect(winner).toBe('a')
  expect(loser).toBe('b')
})
