import 'isomorphic-unfetch';
import * as Client from './client';
import * as Errors from './errors';
import Zendesk from './zendesk';
declare const _default: ({ subdomain, email, token }: Client.AuthProps, opts?: Client.ConstructorOpts | undefined) => Client.FetchMethod;
export default _default;
export { Client, Errors, Zendesk };
