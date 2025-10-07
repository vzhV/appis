import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "**/.next/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/build/**",
      "**/out/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn", // Changed from error to warn
      "@typescript-eslint/explicit-function-return-type": "warn", // Changed from error to warn
      "@typescript-eslint/explicit-module-boundary-types": "warn", // Changed from error to warn
      
      // React specific rules
      "react/no-unescaped-entities": "warn", // Changed from error to warn
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // General code quality rules
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-template": "warn", // Changed from error to warn
    },
  },
];

export default eslintConfig;
