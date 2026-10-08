import { http, normalize, resourceId, type RequestOptions } from '@shared/api';
import { IS_DEMO } from '@shared/config';
import type * as Wire from '@shared/api';
import type { Account, AccountApi } from '../model/types';
import { accountApi as demo } from './account.mock';
const real: AccountApi = { list: async options => normalize<Account[]>(await http.get('/accounts', options)), get: async (id, options) => normalize<Account>(await http.get('/accounts/' + resourceId(id), options)), };
export const accountApi = { ...(IS_DEMO ? demo : real), create: async (input: Wire.AccountInput, options?: RequestOptions) => normalize<Account>(await http.command('/accounts', input, options)), update: async (id: string, input: Wire.AccountInput, options?: RequestOptions) => normalize<Account>(await http.patch('/accounts/' + resourceId(id), input, options)), remove: (id: string, options?: RequestOptions) => http.delete<Wire.RemovalView>('/accounts/' + resourceId(id), options),  };
