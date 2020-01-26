import initZendeskAPI from '../'

export const zendeskAPI = initZendeskAPI({
  subdomain: process.env.SUBDOMAIN as string,
  email: process.env.EMAIL as string,
  token: process.env.TOKEN as string,
})
