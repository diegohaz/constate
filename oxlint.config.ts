import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
    suspicious: "error",
  },
  rules: {
    "typescript/consistent-type-imports": [
      "error",
      { fixStyle: "separate-type-imports", prefer: "type-imports" },
    ],
    "typescript/no-unsafe-type-assertion": "off",
    "eslint/no-unused-vars": "error",
    "eslint/sort-imports": ["error", { ignoreDeclarationSort: true }],
    "eslint/no-shadow": "off",
    "typescript/consistent-return": "off",
    "unicorn/consistent-function-scoping": "off",
  },
});
