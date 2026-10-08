import { http, normalize, resourceId, type RequestOptions } from '@shared/api';
import { IS_DEMO } from '@shared/config';
import type * as Wire from '@shared/api';
import type { Category, CategoryApi } from '../model/types';
import { categoryApi as demo } from './category.mock';
const real: CategoryApi = { list: async options => normalize<Category[]>(await http.get('/categories', options)),  };
export const categoryApi = { ...(IS_DEMO ? demo : real), create: async (input: Wire.CategoryInput, options?: RequestOptions) => normalize<Category>(await http.command('/categories', input, options)), update: async (id: string, input: Wire.CategoryInput, options?: RequestOptions) => normalize<Category>(await http.patch('/categories/' + resourceId(id), input, options)), remove: (id: string, options?: RequestOptions) => http.delete<Wire.RemovalView>('/categories/' + resourceId(id), options),  };
