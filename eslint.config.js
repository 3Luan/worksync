import vueParser from "vue-eslint-parser";
import vue from "eslint-plugin-vue";
import tsParser from "@typescript-eslint/parser";
import ts from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      "node_modules",
      "vendor",
      "public",
      "storage",
      "bootstrap",
      "docker",
      "*.config.js",
    ],
  },

  {
    files: ["resources/js/**/*.{js,ts,vue}"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
    plugins: {
      vue,
      "@typescript-eslint": ts,
      prettier,
    },
    rules: {
      ...vue.configs["vue3-recommended"].rules,
      ...ts.configs.recommended.rules,
      ...prettierConfig.rules,

      "prettier/prettier": "error",

      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
