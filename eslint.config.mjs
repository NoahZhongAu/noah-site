import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import boundaries from "eslint-plugin-boundaries";
import prettier from "eslint-config-prettier/flat";

// The four layers of CLAUDE.md, plus the two support folders that may import
// anything but that nothing may import. Dependencies point inward only.
const layers = [
  { type: "content", pattern: "content/**" },
  { type: "domain", pattern: "src/domain/**" },
  { type: "application", pattern: "src/application/**" },
  { type: "components", pattern: "src/components/**" },
  { type: "app", pattern: "src/app/**" },
  { type: "styles", pattern: "src/styles/**" },
  { type: "tests", pattern: "tests/**" },
  { type: "scripts", pattern: "scripts/**" },
];

const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
    ".lighthouseci/**",
  ]),
  ...nextVitals,
  ...nextTs,
  ...tseslint.configs.recommendedTypeChecked,
  // eslint-config-next already registers the jsx-a11y plugin; only its strict
  // rule set is layered on top, since a plugin cannot be registered twice.
  { rules: jsxA11y.flatConfigs.strict.rules },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-ignore": "allow-with-description", minimumDescriptionLength: 10 },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Config files at the root are plain modules that are not part of the
  // TypeScript project, so type-aware rules cannot run on them.
  {
    files: ["*.mjs", "*.js", "scripts/**/*.mjs"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ["src/**", "content/**"],
    rules: {
      // PRD §10: scroll effects use IntersectionObserver or CSS, never per-frame JS.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.property.name='addEventListener'][arguments.0.value='scroll']",
          message:
            "No scroll listeners. Use IntersectionObserver or CSS (PRD §10).",
        },
      ],
    },
  },
  {
    files: ["src/domain/**"],
    rules: {
      // Domain is pure: no framework, no I/O. Zod is the one library it may use.
      "no-restricted-imports": [
        "error",
        {
          paths: ["react", "react-dom", "next", "motion"],
          patterns: [
            "react/*",
            "react-dom/*",
            "next/*",
            "motion/*",
            "@vercel/*",
            "node:*",
          ],
        },
      ],
    },
  },
  {
    files: ["src/**", "content/**", "tests/**", "scripts/**"],
    plugins: { boundaries },
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true, project: "./tsconfig.json" },
        node: { extensions: [".js", ".mjs", ".ts", ".tsx"] },
      },
      "boundaries/elements": layers,
      "boundaries/files": [
        {
          category: "application-entry",
          pattern: [
            "src/application/email/index.ts",
            "src/application/contact/**",
          ],
        },
      ],
      "boundaries/ignore": ["**/*.css"],
    },
    rules: {
      "boundaries/no-unknown-files": "error",
      "boundaries/no-unknown-dependencies": "error",
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            {
              from: { element: { type: "content" } },
              allow: { to: { element: { type: "content" } } },
            },
            {
              from: { element: { type: "domain" } },
              allow: {
                to: { element: { types: { anyOf: ["content", "domain"] } } },
              },
            },
            {
              from: { element: { type: "application" } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ["content", "domain", "application"] },
                  },
                },
              },
            },
            {
              from: { element: { type: "components" } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ["content", "domain", "components"] },
                  },
                },
              },
            },
            {
              from: { element: { type: "app" } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        "content",
                        "domain",
                        "components",
                        "app",
                        "styles",
                      ],
                    },
                  },
                },
              },
            },
            // The route layer reaches application only through the email
            // factory and the contact handler, never the SDK-bound sender.
            {
              from: { element: { type: "app" } },
              allow: { to: { file: { categories: "application-entry" } } },
            },
            {
              from: { element: { types: { anyOf: ["tests", "scripts"] } } },
              allow: { to: { element: { type: "*" } } },
            },
            // External packages are governed by no-restricted-imports above, not by layer.
            { allow: { to: { module: { origin: "external" } } } },
            { allow: { to: { module: { origin: "core" } } } },
          ],
        },
      ],
    },
  },
  prettier,
]);

export default eslintConfig;
