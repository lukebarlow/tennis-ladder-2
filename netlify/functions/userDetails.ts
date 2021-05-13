import cookie from 'cookie'
import { Handler } from '@netlify/functions'
import getCookie from '../../src/server/getCookie'
import { tokenCookieName } from '../../src/server/config'
import getDb from '../../src/server/getDb'

const handler : Handler = async (event) => {
  const db = getDb()
  const cookies = cookie.parse(event.headers.cookie)
  const token = cookies[tokenCookieName]
  await db.deleteOldSessions()
  const session = await db.findSession(token)
  // check if this token is still good

  if (session) {
    await db.updateSession(session._id)
    const userId = session.userId
    const isAdmin = await db.getIsAdmin(userId)
    const tokenCookie = getCookie(token)
    return {
      headers: {
        'Set-Cookie': tokenCookie
      },
      statusCode: 200,
      body: JSON.stringify({ userId, isAdmin })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({isAdmin: false})
  }

}

export { handler }
