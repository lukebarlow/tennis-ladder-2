import cookie from 'cookie'
import { v4 as uuidv4 } from 'uuid'

import getDb from '../../src/server/getDb'
import getCookie from '../../src/server/getCookie'
import { tokenCookieName, tokenMaxAge } from '../../src/server/config'
import getSession from '../../src/server/getSession'

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  try {
    const db = getDb()
    const session = await getSession(db, event)

    if (session) {
      db.deleteSession(session._id)
    }

    const blankCookie = cookie.serialize('tenn16-login', '', {
      secure: true,
      httpOnly: true,
      path: '/',
      maxAge: 0,
    })

    return {
      headers: {
        'Set-Cookie': blankCookie
      },
      statusCode: 200,
      body: JSON.stringify(true)
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

export { handler }
