module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb", "prettier/react", "plugin:prettier/recommended"],
  env: {
    jest: true,
    browser: true
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    camelcase: "off",
    "no-use-before-define": "off",
    "no-underscore-dangle": "off",
    "no-bitwise": "off",
    "no-restricted-syntax": "off",
    "react/jsx-props-no-spreading": "off",
    "react/no-array-index-key": "off",
    "react/prop-types": "off",
    "react/button-has-type": "off",
    "react/forbid-prop-types": "off",
    "react/jsx-filename-extension": "off",
    "react/require-default-props": "off",
    "react/destructuring-assignment": "off",
    "import/no-extraneous-dependencies": "off",
    "import/prefer-default-export": "off",
    "jsx-a11y/no-autofocus": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/label-has-for": "off",
    "jsx-a11y/label-has-associated-control": "off"
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
        // TODO: Temporary fix https://github.com/typescript-eslint/typescript-eslint/issues/890
        createDefaultProgram: true
      },
      plugins: ["@typescript-eslint"],
      rules: {
        "no-undef": "off",
        "no-unused-vars": "off",
        "no-restricted-globals": "off",
        "no-use-before-define": "off"
      }
    }
  ]
};
