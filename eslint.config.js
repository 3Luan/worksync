import eslintPluginVue from "eslint-plugin-vue";
import prettierPlugin from "eslint-plugin-prettier";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";

/** @type {import("eslint").Linter.FlatConfig} */
export default [
  {
    ignores: [
      "**/libs/*.js",
      "**/public",
      "vue.config.js",
      "**/types/*.d.ts",
      "webpack.mix.js",
      "tailwind.config.js",
      "**/presets/**/*.js",
    ],
  },
  {
    files: ["**/*.ts", "**/*.js", "**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: "module",
        requireConfigFile: false,
      },
      globals: {
        Swal: "readonly",
        $: "readonly",
        _: "readonly",
      },
    },
    plugins: {
      vue: eslintPluginVue,
      prettier: prettierPlugin,
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      semi: "error",
      "no-console": "off",
      "no-useless-escape": "off",
      "no-constant-condition": "off",
      "no-unused-vars": "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-irregular-whitespace": "off",
      "vue/max-attributes-per-line": "off",
      "vue/no-v-model-argument": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
      "vue/no-v-html": "off",
      "vue/no-v-for-template-key": "off",
      "vue/no-template-key": "off",
      "vue/require-component-is": "off",
      "vue/no-multiple-template-root": "off",
      "vue/no-unused-components": "off",
      "vue/no-irregular-whitespace": "off",
      "vue/multi-word-component-names": [
        "off",
        {
          ignores: ["default"],
        },
      ],
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
          },
        },
      ],
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
];
