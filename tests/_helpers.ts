import createClient from '../src'

console.log('process.env.TOKEN', process.env.TOKEN)
export const zendeskAPI = createClient(
  {
    subdomain: process.env.SUBDOMAIN as string,
    email: process.env.EMAIL as string,
    token: process.env.TOKEN as string,
  },
  { log: false }
)
