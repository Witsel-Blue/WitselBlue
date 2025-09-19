module.exports = {
    env: {
        browser: true,
        node: true
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    plugins: ['vue'],
    extends: ['eslint:recommended', 'plugin:vue/recommended'],
    rules: {
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'no-tabs': 'error'
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                'vue/html-indent': ['warn', 4]
            }
        }
    ]
};