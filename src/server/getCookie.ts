import cookie from 'cookie'
import { tokenCookieName, tokenMaxAge } from './config'

export default (token) => (
  cookie.serialize(tokenCookieName, token, {
    secure: true,
    httpOnly: true,
    path: '/',
    maxAge: tokenMaxAge,
  })
)