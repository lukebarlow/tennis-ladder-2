export default function daysToPlay (date) {
  var daysGone = Math.floor((Date.now() - date) / (1000 * 60 * 60 * 24))
  return 28 - daysGone
}
