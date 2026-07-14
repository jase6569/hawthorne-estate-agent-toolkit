const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "eslint.config.js"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
