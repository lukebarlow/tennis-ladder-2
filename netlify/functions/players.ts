import { Handler } from '@netlify/functions'
import getDb from '../../src/server/getDb'

const handler: Handler = async (event) => {
  try {
    const db = getDb()
    const result = await db.getPlayers()
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

export { handler }
