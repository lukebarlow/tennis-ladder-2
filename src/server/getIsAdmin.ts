import getSession from './getSession'

export default async (db, event) => {
  const session = await getSession(db, event)
  if (!session) {
    return false
  }
  const userId = session.userId
  return await db.getIsAdmin(userId)
}