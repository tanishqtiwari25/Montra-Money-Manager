const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const original = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) { const match = /^@(shared|entities|features|widgets|pages|app)\/(.+)$/.exec(request); const target = match ? path.resolve(root, 'src', match[1], match[2]) : request; return original.call(this, target, parent, ...rest); };
function loadTs(module, filename) { const source = fs.readFileSync(filename, 'utf8').replaceAll('import.meta.env.VITE_API_BASE_URL', 'undefined'); const result = ts.transpileModule(source, { fileName: filename, compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }); module._compile(result.outputText, filename); }
require.extensions['.ts'] = loadTs;
require.extensions['.tsx'] = loadTs;
require(path.resolve(root, process.argv[2] ?? 'tests/domain.test.ts'));
