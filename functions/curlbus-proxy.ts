import { Handler } from '@netlify/functions'
import fetch from 'node-fetch'

export const handler: Handler = async (event, context) => {
  const { stopIds } = event.queryStringParameters

  const curlbusResponse = await fetch(`https://curlbus.app/${stopIds}`, {
    headers: { Accept: 'application/json' },
  })
  const body = await curlbusResponse.text()

  return {
    statusCode: 200,
    body,
  }
}
