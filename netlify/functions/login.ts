import cookie from 'cookie'
import { v4 as uuidv4 } from 'uuid'

import getDb from '../../src/server/getDb'
import getCookie from '../../src/server/getCookie'

const handler = async (event) => {
  try {
    const db = getDb()
    const { name, password } = JSON.parse(event.body)
    const result =  await db.authenticate(name, password)

    // if successful, the result is the user. In this case,
    // we need to create a token cookie
    if (result) {
      // generate a cookie token which we associate with
      // this user being logged in

      const token = uuidv4()
      await db.addSession(result, token)
      const tokenCookie = getCookie(token)

      return {
        headers: {
          'Set-Cookie': tokenCookie
        },
        statusCode: 200,
        body: JSON.stringify(result)
      }
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
      body: JSON.stringify(result)
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

export { handler }
