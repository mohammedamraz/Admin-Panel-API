module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: false,
  env: {
    node: false,
    jest: false,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
		"no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
		"no-multi-spaces": ["error"],
		"no-trailing-spaces": [
			"error",
			{ "skipBlankLines": false, "ignoreComments": false }
		],
		// "no-magic-numbers": [
		// 	"error",
		// 	{ "ignoreArrayIndexes": true, "ignoreDefaultValues": true }
		// ],
		"no-lonely-if": "error",
		"no-inline-comments": "error",
		"no-implicit-globals": ["error", { "lexicalBindings": false }],
		"no-empty-function": [
			"error",
			{
				"allow": [
					"arrowFunctions",
					"generatorFunctions",
					"methods",
					"generatorMethods",
					"getters",
					"setters",
					"constructors",
					"asyncFunctions",
					"asyncMethods"
				]
			}
		],
		"no-alert": "error",
		"new-cap": [
			"error",
			{
				"newIsCap": false,
				"capIsNew": false,
				"capIsNewExceptions": ["Injectable", "Component", "NgModule", "Input", "Output", "HostBinding", "Pipe", "Exclude", "Schema", "Prop", "InjectModel"]
			}
		],
		"key-spacing": [
			"error",
			{ "beforeColon": false, "afterColon": true, "mode": "strict" }
		],
		"function-paren-newline": ["error", "never"],
		"function-call-argument-newline": ["error", "never"],
		"func-call-spacing": ["error", "never"],
		"eol-last": ["error", "always"],
		"space-in-parens": ["error", "never"],
		"computed-property-spacing": ["error", "never"],
		"array-bracket-spacing": ["error", "never"],
		"comma-spacing": ["error", { "before": false, "after": true }],
		"comma-dangle": ["error", "never"],
		"camelcase": [
			"error",
			{ "ignoreDestructuring": true, "ignoreImports": true,"properties": "never" }
		],
		"curly": ["error", "multi", "consistent"],
		"brace-style": ["error", "1tbs", { "allowSingleLine": true }],
		"eqeqeq": "error",
		"max-depth": ["error", 4],
		"max-lines": [
			"error",
			{ "max": 200, "skipBlankLines": true, "skipComments": true }
		],
		"max-lines-per-function": ["error", { "max": 30 }],
		"lines-between-class-members": [
			"error",
			"always",
			{ "exceptAfterSingleLine": true }
		],
		"padding-line-between-statements": [
			"error",
			{ "blankLine": "never", "prev": "*", "next": "block-like" }
		],
		"yoda": "error"
  },
};
