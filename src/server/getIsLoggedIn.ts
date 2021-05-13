import getSession from './getSession'

export default async (db, event) => {
  const session = getSession(db, event)
  return !!session
}