import ZendeskAPI from '../'

test('all operations', async () => {
  const api = ZendeskAPI({ subdomain: 'indigovdev', email: 'ethan@indigov.us', token: 'yCDDcinEaYirZsDKE0DfJd6B4cq34pJPNZMvW3Xk' })
  console.log(await api('/triggers'))
})
