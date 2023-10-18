module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  globals: {
    $fetch: false,
  },
  extends: ['@nuxt/eslint-config', 'plugin:prettier/recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true },
    ],
  },
}
