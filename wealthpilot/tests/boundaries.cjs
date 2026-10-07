const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { resolve } = require('node:path');
const root = resolve(__dirname, '..');
const requireProject = createRequire(resolve(root, 'package.json'));
const { ESLint } = requireProject('eslint');
process.chdir(root);
const eslint = new ESLint({ cwd: root });
async function probe(name, code, filePath, rule) {
  const [result] = await eslint.lintText(code, { filePath: resolve(root, filePath) });
  assert.ok(result.messages.some(message => message.ruleId === rule), name + ': rule did not reject import');
  console.log('PASS ' + name);
}
async function main() {
  await probe('same-layer entity imports rejected', "import { goalApi } from '@entities/goal';\nvoid goalApi;", 'src/entities/account/api/probe.ts', 'boundaries/element-types');
  await probe('cross-slice internal imports rejected', "import { ApiError } from '@shared/api/types';\nvoid ApiError;", 'src/entities/account/api/probe.ts', 'boundaries/entry-point');
  await probe('upward imports from shared rejected', "import { userApi } from '@entities/user';\nvoid userApi;", 'src/shared/lib/probe.ts', 'boundaries/element-types');
  await probe('widget-to-widget imports rejected', "import { Sidebar } from '@widgets/sidebar';\nvoid Sidebar;", 'src/widgets/topbar/ui/probe.ts', 'boundaries/element-types');
  await probe('page-to-page imports rejected', "import { AccountsPage } from '@pages/accounts';\nvoid AccountsPage;", 'src/pages/dashboard/ui/probe.ts', 'boundaries/element-types');
  await probe('feature-to-feature imports rejected', "import { EditTransaction } from '@features/edit-transaction';\nvoid EditTransaction;", 'src/features/add-transaction/ui/probe.ts', 'boundaries/element-types');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
