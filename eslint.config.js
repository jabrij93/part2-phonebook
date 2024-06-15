import globals from 'globals';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.commonjs,
                ...globals.es2021,
            },
        },
        plugins: {
            '@stylistic/js': stylisticJs,
        },
        rules: {
            '@stylistic/js/indent': ['error', 2],
            '@stylistic/js/linebreak-style': ['error', 'unix'],
            '@stylistic/js/quotes': ['error', 'single'],
            '@stylistic/js/semi': ['error', 'never'],
        },
        processorOptions: {
            extends: ['eslint:recommended'],
        },
    },
    {
        files: [".eslintrc.{js,cjs}"],
        languageOptions: {
            sourceType: 'script',
            globals: {
                ...globals.node,
            },
        },
        env: {
            node: true,
        },
    },
];
