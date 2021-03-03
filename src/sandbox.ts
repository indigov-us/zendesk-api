import createClient, { Zendesk } from './'

const main = async () => {
  const api = createClient({
    subdomain: 'repvanduyne',
    getAwsParameterStoreName: (subdomain) => `/ZendeskAPITokens/prod/${subdomain}`,
  })

  try {
    const res = await api('/incremental/users.json?start_time=1613972128')
    console.log(res)
  } catch (e) {
    console.error(e)
  }
}

main().then(() => process.exit())
