module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'boundaries', 'import'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: { browser: true, es2022: true },
  overrides: [{ files: ['src/vite-env.d.ts'], rules: { 'boundaries/no-unknown-files': 'off' } }],
  settings: {
    'import/resolver': { typescript: { project: './tsconfig.json' } },
    'boundaries/include': ['src/**/*'],
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app', mode: 'folder' },
      ...['pages', 'widgets', 'features', 'entities'].map(type => ({
        type, pattern: `src/${type}/*`, mode: 'folder', capture: ['slice'],
      })),
      { type: 'shared', pattern: 'src/shared/*', mode: 'folder', capture: ['segment'] },
    ],
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'boundaries/element-types': ['error', {
      default: 'disallow',
      rules: [
        { from: 'app', allow: ['pages', 'widgets', 'features', 'entities', 'shared'] },
        { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared'] },
        { from: 'widgets', allow: ['features', 'entities', 'shared'] },
        { from: 'features', allow: ['entities', 'shared'] },
        { from: 'entities', allow: ['shared'] },
        { from: 'shared', allow: ['shared'] },
      ],
    }],
    'boundaries/entry-point': ['error', {
      default: 'disallow',
      rules: [{ target: ['pages', 'widgets', 'features', 'entities', 'shared'], allow: 'index.ts' }],
    }],
    'boundaries/no-unknown': 'error',
    'boundaries/no-unknown-files': 'error',
  },
};
