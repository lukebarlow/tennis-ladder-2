// import getDb from '../../src/server/getDb'
// const db = getDb()

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  try {
    // const result = await db.getSinglesMatches()
    return {
      statusCode: 200,
      body: JSON.stringify({isAdmin: false})
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

export { handler }
