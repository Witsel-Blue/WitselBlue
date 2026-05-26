module.exports = {
    env: {
        browser: true,
        node: true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: ['vue', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:vue/recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        'prettier/prettier': 'error',
        'quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
        'no-tabs': 'error',
        'vue/multi-word-component-names': 'off',
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                'prettier/prettier': 'off',
                'vue/html-quotes': ['error', 'single', { 'avoidEscape': true }],
                'vue/html-indent': ['error', 4],
                'vue/script-indent': ['error', 4, { 'baseIndent': 1, 'switchCase': 1 }],
                'vue/multiline-html-element-content-newline': 'off',
                'vue/singleline-html-element-content-newline': 'off',
                'vue/max-attributes-per-line': 'off',
                'vue/html-self-closing': ['error', {
                    'html': { 'void': 'always', 'normal': 'always', 'component': 'always' },
                }],
                'indent': 'off',
            },
        },
    ],
};
