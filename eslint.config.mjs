import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  {
    rules: {
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
    },
  },
  eslintConfigPrettier,
  {
    overrides: [
      {
        files: ["tests/**/*"],
        env: {
          jest: true,
        },
      },
    ],
  },
];
