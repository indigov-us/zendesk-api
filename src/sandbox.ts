import createClient, { Zendesk } from './'

const main = async () => {
  const api = createClient(
    {
      subdomain: 'something',
      getAwsParameterStoreName: (subdomain) => `/ZendeskAPITokens/prod/${subdomain}`,
    },
    {
      log: true,
    }
  )

  try {
    const res = await api('/something')
    console.log(res)
  } catch (e) {
    console.error(e)
  }
}

main().then(() => process.exit())
