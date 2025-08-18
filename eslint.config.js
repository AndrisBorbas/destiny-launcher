import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import { globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactDom from "eslint-plugin-react-dom";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactX from "eslint-plugin-react-x";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint, { configs as tsConfigs } from "typescript-eslint";

/** @type { import("typescript-eslint").Config } */
export default tseslint.config([
	globalIgnores(["dist", "build", "node_modules", ".next", "destiny-icons"]),
	{
		name: "typescript",
		files: ["**/*.{js,jsx,ts,tsx,mts}"],
		languageOptions: {
			ecmaVersion: "latest",
			globals: globals.browser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		extends: [
			js.configs.recommended,
			tsConfigs.strictTypeChecked,
			tsConfigs.stylisticTypeChecked,
			importPlugin.flatConfigs.recommended,
			importPlugin.flatConfigs.typescript,
			importPlugin.flatConfigs.react,
			reactPlugin.configs.flat.recommended,
			reactPlugin.configs.flat["jsx-runtime"],
			reactX.configs["recommended-typescript"],
			reactDom.configs.recommended,
			reactHooks.configs["recommended-latest"],
			jsxA11y.flatConfigs.recommended,
			reactRefresh.configs.vite,
			eslintConfigPrettier,
		],
		plugins: {
			"simple-import-sort": simpleImportSort,
			"@next/next": next,
		},
		settings: {
			"import/resolver": {
				typescript: true,
				node: true,
			},
			react: {
				version: "19",
			},
		},
		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					varsIgnorePattern: "^_",
					argsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					ignoreRestSiblings: true,
				},
			],

			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
			"sort-imports": "off",
			"import/order": "off",

			eqeqeq: "error",

			/* Custom preferences */
			"@typescript-eslint/array-type": "error",
			"@typescript-eslint/consistent-indexed-object-style": [
				"warn",
				"index-signature", // Prevent ambiguity with Records & Tuples
			],
			"@typescript-eslint/method-signature-style": "warn", // Force type safety
			"@typescript-eslint/consistent-type-definitions": ["warn", "type"],
			"@typescript-eslint/no-empty-object-type": [
				"warn",
				{ allowInterfaces: "always" },
			],
			"@typescript-eslint/restrict-template-expressions": [
				"error",
				{
					allowNumber: true,
				},
			],
		},
	},
	{
		name: "typescript-definitions",
		files: ["**/*.d.ts"],
		rules: {
			"@typescript-eslint/consistent-type-definitions": "off", // Allow interface definitions in .d.ts files
		},
	},
	{
		name: "react",
		files: ["**/*.{tsx,jsx}"],
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			"@typescript-eslint/consistent-type-definitions": ["warn", "type"],
			"import/no-default-export": "warn", // Default exports are confusing
			"import/prefer-default-export": "off",
			"react/require-default-props": "off", // React `defaultProps` are deprecated
			"react/prop-types": "off",
			"react/self-closing-comp": "warn",
			"react/jsx-boolean-value": ["warn", "never"], // Always use boolean values in JSX
			"react/jsx-props-no-spreading": "off", // TypeScript makes this safe
		},
	},
	{
		name: "pages-override",
		files: ["src/pages/**/*", "src/root.tsx", "src/catchall.tsx"],
		rules: {
			"@typescript-eslint/no-empty-function": "off",
			"react-refresh/only-export-components": "off",
			"import/no-default-export": "off",
			"import/prefer-default-export": "warn",
			"@typescript-eslint/require-await": "off",
		},
	},
	{
		name: "api-override",
		files: ["src/pages/api/**/*"],
		rules: {
			"@typescript-eslint/require-await": "off",
		},
	},
	{
		name: "test",
		files: [
			"**/*.test.{js,jsx,ts,tsx}",
			"**/*.spec.{js,jsx,ts,tsx}",
			"**/*test*/**/*.{js,jsx,ts,tsx}",
		],
		rules: {
			"react-refresh/only-export-components": "off", // Tests don't need this
			"@typescript-eslint/no-empty-function": "off", // Tests often use empty functions
			"@typescript-eslint/no-explicit-any": "off", // Tests often use `any` for flexibility
		},
	},
]);
