module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:vue/vue3-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	parser: 'vue-eslint-parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		parser: '@typescript-eslint/parser',
	},
	plugins: ['vue', '@typescript-eslint'],
	rules: {
		'@typescript-eslint/consistent-type-imports': 'error',
		'@typescript-eslint/no-unused-vars': 'warn',
		'no-unused-vars': 'warn',
		'vue/no-unused-components': 'warn',
		'vue/multi-word-component-names': 'warn',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-duplicate-enum-values': 'warn',
		'@typescript-eslint/ban-types': 'warn',
		'@typescript-eslint/ban-ts-comment': 'warn',
		'@typescript-eslint/no-this-alias': 'warn',
		'no-undef': 'warn',
		'vue/no-setup-props-destructure': 'warn',
		'@typescript-eslint/no-empty-function': 'warn'
	},
	overrides: [
		{
			files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx,vue}'],
			extends: ['plugin:cypress/recommended'],
		},
	],
	ignorePatterns: ["**/*.css", "**/*.scss"],
};
