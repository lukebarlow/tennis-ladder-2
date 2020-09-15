const { timeFormat } = require('d3-time-format')
const formatTime = timeFormat('%Y/%m/%d')

module.exports = (match, sideAName, sideBName) => {
  const m = match
  const score = m.score.map(function (set) { return set[0] + '-' + set[1] }).join(', ')
  const name = `${formatTime(new Date(m.date))} ${sideAName} v ${sideBName} ${score}`
  return name
}
