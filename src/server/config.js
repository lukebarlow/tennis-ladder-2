// with heroku the config variables are all coming from the environment
// variables. When running locally, these are found in the .env file,
// and when on heroku, they are configured in the app settings
module.exports = {
  email: {
    host: process.env.EMAIL_HOST,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    sender: process.env.EMAIL_SENDER
  },
  siteName: process.env.SITE_NAME,
  domainName: process.env.DOMAIN_NAME,
  mongoDbName: process.env.MONGODB_URI,
  port: process.env.PORT
}
