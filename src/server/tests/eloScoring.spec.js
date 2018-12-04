/* global test expect */

import eloScoring from '../eloScoring'

test('two players at 1200', () => {
  const { newRatingA, newRatingB, ratingsMoveBy } = eloScoring(1200, 1200, 1)
  expect(ratingsMoveBy).toBe(16)
  expect(newRatingA).toBe(1216)
  expect(newRatingB).toBe(1184)
})

test('revenge upset match', () => {
  const { newRatingA, newRatingB, ratingsMoveBy } = eloScoring(1216, 1184, 0)
  expect(ratingsMoveBy).toBe(-17)
  expect(newRatingA).toBe(1199)
  expect(newRatingB).toBe(1201)
})

test('higher rank wins as expected', () => {
  const { ratingsMoveBy } = eloScoring(1400, 1200, 1)
  expect(ratingsMoveBy).toBe(7)
})

test('higher rank loses in upset, bigger chnage in scores', () => {
  const { ratingsMoveBy } = eloScoring(1200, 1400, 1)
  expect(ratingsMoveBy).toBe(24)
})
