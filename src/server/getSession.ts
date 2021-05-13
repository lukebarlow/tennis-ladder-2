import cookie from 'cookie'
import { tokenCookieName } from './config'

export default async (db, event) => {
  const cookies = cookie.parse(event.headers.cookie)
  const token = cookies[tokenCookieName]
  await db.deleteOldSessions()
  const session = await db.findSession(token)
  if (session) {
    await db.updateSession(session._id)
  }
  return session
}