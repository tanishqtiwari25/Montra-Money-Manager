const { spawnSync } = require('node:child_process');
const { resolve } = require('node:path');
const root = resolve(__dirname, '..');
for (const args of [['tests/register.cjs', 'tests/domain.test.ts'], ['tests/register.cjs', 'tests/features.test.ts'], ['tests/boundaries.cjs']]) { const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' }); if (result.status !== 0) { process.exitCode = result.status ?? 1; break; } }

if (!process.exitCode) { const result = spawnSync(process.execPath, ['tests/register.cjs', 'tests/api.test.ts'], { cwd: root, stdio: 'inherit', env: { ...process.env, WEALTHPILOT_TEST_MODE: 'api' } }); if (result.status !== 0) process.exitCode = result.status ?? 1; }
