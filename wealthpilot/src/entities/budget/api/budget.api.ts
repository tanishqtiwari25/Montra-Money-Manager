import { http, normalize, queryString, resourceId, type RequestOptions } from '@shared/api';
import { IS_DEMO } from '@shared/config';
import type { BudgetInput as CreateBudgetInput } from '@shared/api';
import type { Budget, BudgetApi } from '../model/types';
import { budgetApi as demo } from './budget.mock';
const real: BudgetApi = { list: async (month, options) => normalize(await http.get('/budgets' + queryString({ month }), options)), update: async (id, input, options) => normalize(await http.patch('/budgets/' + resourceId(id), input, options)) };
export const budgetApi = { ...(IS_DEMO ? demo : real), create: (input: CreateBudgetInput, options?: RequestOptions) => http.command<Budget>('/budgets', input, options), remove: (id: string, options?: RequestOptions) => http.delete('/budgets/' + resourceId(id), options) };
