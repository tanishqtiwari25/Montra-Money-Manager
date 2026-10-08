import { http, normalize } from '@shared/api';
import { IS_DEMO } from '@shared/config';
import type { UserApi } from '../model/types';
import { userApi as demo } from './user.mock';
const real: UserApi = { get: async options => normalize(await http.get('/profile', options)), update: async (input, options) => normalize(await http.patch('/profile', input, options)) };
export const userApi = IS_DEMO ? demo : real;
