import { FetchMethod } from './client';
import Zendesk from './zendesk';
declare const _default: (fetchMethod: FetchMethod) => (email: string) => Promise<Zendesk.User | undefined>;
export default _default;
