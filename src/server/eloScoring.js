/*
  Given the previous ratings for players A and B,
  and the result of a match (where resultForA = 1
  means A won, 0.5 means it was a draw, and 0 means
  B won), will return a data structure looking as
  follows

    {
      newRatingA: 1216,
      newRatingB: 1184,
      ratingsMoveBy: 16
    }

  where 'ratingsMoveBy' will be positive if player A's
  score goes up (and B's goes down), and negative if
  player A's score goes down (and B's goes up)

  The calculation follows the system described
  here https://metinmediamath.wordpress.com/2013/11/27/how-to-calculate-the-elo-rating-including-example/
  where we are using the subscripts a and b instead of 1 and 2.
*/

const K = 32

module.exports = function (ratingA, ratingB, resultForA) {
  const Ra = Math.pow(10, ratingA / 400)
  const Rb = Math.pow(10, ratingB / 400)
  const Ea = Ra / (Ra + Rb)
  const Sa = resultForA
  const ratingsMoveBy = ~~(K * (Sa - Ea))
  return {
    newRatingA: ratingA + ratingsMoveBy,
    newRatingB: ratingB - ratingsMoveBy,
    ratingsMoveBy
  }
}
