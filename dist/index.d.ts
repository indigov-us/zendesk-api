import 'isomorphic-unfetch';
import * as Client from './client';
import * as Errors from './errors';
import jobCompletion from './job-completion';
import Zendesk from './zendesk';
declare const _default: ({ subdomain, email, token, base64Token }: Client.AuthProps, opts?: Client.ConstructorOpts | undefined) => Client.FetchMethod;
export default _default;
export { Client, Errors, Zendesk, jobCompletion };
