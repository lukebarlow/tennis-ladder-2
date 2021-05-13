// with heroku the config variables are all coming from the environment
// variables. When running locally, these are found in the .env file,
// and when on heroku, they are configured in the app settings
const hourInSeconds = 60 * 60
const weekInSeconds = 7 * 24 * hourInSeconds

module.exports = {
  email: {
    sender: process.env.EMAIL_SENDER
  },
  siteName: process.env.SITE_NAME,
  domainName: process.env.DOMAIN_NAME,
  mongoDbUri: process.env.MONGODB_URI,
  // mongoDbUri: testMongoDbUri,
  port: process.env.PORT,
  tokenCookieName: 'tenn16-login',
  tokenMaxAge: weekInSeconds * 3
}
