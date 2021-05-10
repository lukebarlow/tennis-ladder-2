// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  try {
    const result = {
      daysSincePlayedCutoffSingles: parseInt(process.env.DAYS_SINCE_PLAYED_CUTOFF_SINGLES),
      daysSincePlayedCutoffDoubles: parseInt(process.env.DAYS_SINCE_PLAYED_CUTOFF_DOUBLES)
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

export { handler }
