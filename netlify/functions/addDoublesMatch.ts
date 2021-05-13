import { Handler } from '@netlify/functions'
import getDb from '../../src/server/getDb'
import getIsLoggedIn from '../../src/server/getIsLoggedIn'

const handler : Handler = async (event) => {
  try {
    const db = getDb()
    const isLoggedIn = getIsLoggedIn(db, event)
    if (!isLoggedIn) {
      return {
        statusCode: 403,
        body: 'Insufficient permission'
      }
    }
    const match = JSON.parse(event.queryStringParameters.match)
    await db.addDoublesMatch(match)
    return {
      statusCode: 200,
      body: JSON.stringify(true)
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

export { handler }