import { http, normalize, resourceId, type RequestOptions } from '@shared/api';
import { IS_DEMO } from '@shared/config';
import type { ContributionView } from '@shared/api';
import type { GoalPlanView } from '../model/plan';
import type { GoalApi } from '../model/types';
import { goalApi as demo } from './goal.mock';
const real: GoalApi = { list: async options => normalize(await http.get('/goals', options)), get: async (id, options) => normalize(await http.get('/goals/' + resourceId(id), options)), create: async (input, options) => normalize(await http.command('/goals', input, options)), contribute: async (id, input, options) => normalize(await http.command('/goals/' + resourceId(id) + '/contributions', input, options)), purchase: async (id, input, options) => normalize(await http.command('/goals/' + resourceId(id) + '/purchase', input, options)), acknowledgeAchievement: async (id, options) => normalize(await http.patch('/goals/' + resourceId(id) + '/achievement', undefined, options)) };
export const goalApi = { plan: (options?: RequestOptions) => http.get<GoalPlanView>('/goals/plan', options), priority: (id: string, input: {priority: 'high'|'medium'|'low'; targetDate: string|null}, options?: RequestOptions) => http.patch('/goals/' + resourceId(id) + '/priority', input, options), ...(IS_DEMO ? demo : real), contributions: (id: string, options?: RequestOptions) => http.get<ContributionView[]>('/goals/' + resourceId(id) + '/contributions', options) };
