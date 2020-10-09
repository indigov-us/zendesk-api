import * as Client from './client'
import * as Errors from './errors'
import createOrUpdateManyUsers from './create-or-update-many-users'
import fastPaginate from './fast-paginate'
import jobCompletion from './job-completion'
import Zendesk from './zendesk'

export default Client.createClient
export { Client, Errors, Zendesk, createOrUpdateManyUsers, fastPaginate, jobCompletion }
