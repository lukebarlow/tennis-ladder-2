import { Handler } from '@netlify/functions'
import getDb from '../../src/server/getDb'
import getIsAdmin from '../../src/server/getIsAdmin'

const handler : Handler = async (event) => {
  try {
    const db = getDb()
    const isAdmin = getIsAdmin(db, event)
    if (!isAdmin) {
      return {
        statusCode: 403,
        body: 'Insufficient permission to add a user'
      }
    }
    const { name, password, email } = event.queryStringParameters
    await db.addPlayer(name, password, email, {})
    return {
      statusCode: 200,
      body: JSON.stringify(true)
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

export { handler }