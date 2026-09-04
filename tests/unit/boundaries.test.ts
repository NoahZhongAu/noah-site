import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ESLint } from "eslint";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * PRD §9: the lint must fail when presentation imports application or when
 * domain imports a framework. Fixtures are written under src/ because the
 * boundary rule classifies files by path, then removed again.
 */
const root = process.cwd();
const fixtures = {
  componentImportsApplication:
    "src/components/primitives/__boundary_fixture__.tsx",
  domainImportsReact: "src/domain/__boundary_fixture__.ts",
  applicationTarget: "src/application/email/__boundary_fixture__.ts",
} as const;

function write(relative: string, source: string) {
  const path = join(root, relative);
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, source);
}

async function ruleIdsFor(relative: string): Promise<string[]> {
  const eslint = new ESLint({ cwd: root });
  const [result] = await eslint.lintFiles([relative]);
  return (result?.messages ?? []).map((m) => m.ruleId ?? "unknown");
}

describe("layer boundaries", () => {
  beforeAll(() => {
    write(fixtures.applicationTarget, "export const sender = 1;\n");
    write(
      fixtures.componentImportsApplication,
      'import { sender } from "@/application/email/__boundary_fixture__";\nexport const Bad = () => sender;\n',
    );
    write(
      fixtures.domainImportsReact,
      'import { useState } from "react";\nexport const bad = useState;\n',
    );
  });

  afterAll(() => {
    for (const relative of Object.values(fixtures))
      rmSync(join(root, relative), { force: true });
    // Only the fixture created these folders; leave real ones alone.
    for (const dir of [
      "src/application/email",
      "src/application",
      "src/domain",
    ]) {
      try {
        rmSync(join(root, dir), { recursive: false });
      } catch {
        // Folder is not empty, so it belongs to real code.
      }
    }
  });

  it("fails when a component imports from application", async () => {
    expect(await ruleIdsFor(fixtures.componentImportsApplication)).toContain(
      "boundaries/dependencies",
    );
  });

  it("fails when domain imports react", async () => {
    expect(await ruleIdsFor(fixtures.domainImportsReact)).toContain(
      "no-restricted-imports",
    );
  });
});
