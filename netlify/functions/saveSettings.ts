import { Handler } from '@netlify/functions'
import getDb from '../../src/server/getDb'
import getSession from '../../src/server/getSession'

const handler : Handler = async (event) => {
  try {
    const db = getDb()
    const session = await getSession(db, event)
    if (!session.userId) {
      return {
        statusCode: 403,
        body: 'Insufficient permission'
      }
    }
    const settings = JSON.parse(event.body)
    await db.saveSettings(session.userId, settings)
    return {
      statusCode: 200,
      body: JSON.stringify(true)
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

export { handler }