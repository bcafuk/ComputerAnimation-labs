module.exports = {
  'root': true,
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'project': [
      './tsconfig.json',
    ],
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    '@typescript-eslint/lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],

    'no-implicit-coercion': 'error',
    '@typescript-eslint/no-loss-of-precision': 'error',
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/no-empty-function': [
      'error',
      {
        'allow': [
          'private-constructors',
          'protected-constructors',
        ],
      },
    ],
    '@typescript-eslint/no-shadow': ['error', { 'hoist': 'all' }],

    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],

    'no-continue': 'off',
  },
};
