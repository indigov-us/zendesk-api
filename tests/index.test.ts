import createClient, { Client, Errors, Zendesk } from '../src'

// this file exists to make the index file is exporting properly

it('should pass', () => {
  let fetchMethod: Client.FetchMethod
  let authProps: Client.AuthProps
  let constructorProps: Client.ConstructorOpts
  let result: Client.Result<string>
  expect(true)
})
