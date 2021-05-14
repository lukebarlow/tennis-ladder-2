import { Handler } from '@netlify/functions'
import email from '../../src/server/email'

const handler: Handler = async (event) => {
    if (event.queryStringParameters.email) {
      const { email : emailAddress, text } = event.queryStringParameters
      const result = await email.sendTestEmail(emailAddress, text)
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    }
    return {
      statusCode: 200,
      body: 'No email address given'
    }
}

export { handler }
