module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: "eslint:recommended",
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {
		eqeqeq: "error",
		"no-console": 0,
	},
};
