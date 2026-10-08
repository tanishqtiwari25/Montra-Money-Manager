import { http, normalize, resourceId, type RequestOptions } from '@shared/api';
import { IS_DEMO } from '@shared/config';
import type * as Wire from '@shared/api';
import type { Loan, LoanApi } from '../model/types';
import { loanApi as demo } from './loan.mock';
const real: LoanApi = { list: async options => normalize<Loan[]>(await http.get('/loans', options)), get: async (id, options) => normalize<Loan>(await http.get('/loans/' + resourceId(id), options)), };
export const loanApi = { ...(IS_DEMO ? demo : real), create: async (input: Wire.LoanInput, options?: RequestOptions) => normalize<Loan>(await http.command('/loans', input, options)), update: async (id: string, input: Wire.LoanInput, options?: RequestOptions) => normalize<Loan>(await http.patch('/loans/' + resourceId(id), input, options)), remove: (id: string, options?: RequestOptions) => http.delete<Wire.RemovalView>('/loans/' + resourceId(id), options), pay: (id: string, input: Wire.LoanPaymentInput, options?: RequestOptions) => http.command<Loan>('/loans/' + resourceId(id) + '/payments', input, options), };
