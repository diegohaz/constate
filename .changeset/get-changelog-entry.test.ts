/// <reference types="node" />

import { mkdir, mkdtemp, readFile, rm, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import applyReleasePlan from "@changesets/apply-release-plan";
import { expect, test } from "vitest";

test("changesets getChangelogEntry hook", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "changesets-test-"));
  try {
    const packageDir = path.join(tempDir, "pkg-a");
    await mkdir(packageDir, { recursive: true });
    await writeFile(
      path.join(packageDir, "package.json"),
      JSON.stringify({ name: "pkg-a", version: "1.0.0" }, null, 2),
    );

    const releasePlan = {
      changesets: [
        {
          id: "fake-id-1",
          summary: "Overview\n\nAdd awesome feature",
          releases: [{ name: "pkg-a", type: "minor" }],
        },
        {
          id: "fake-id-2",
          summary: "Testing title\n\nAdd awesome feature\n\n2",
          releases: [{ name: "pkg-a", type: "minor" }],
        },
        {
          id: "fake-id-3",
          summary: "Chore: update docs",
          releases: [{ name: "pkg-a", type: "patch" }],
        },
      ],
      releases: [
        {
          name: "pkg-a",
          type: "minor",
          newVersion: "1.1.0",
          changesets: ["fake-id-1", "fake-id-2", "fake-id-3"],
        },
      ],
      preState: undefined,
    } as const;

    const packages = {
      root: { dir: process.cwd() },
      packages: [
        {
          dir: packageDir,
          packageJson: { name: "pkg-a", version: "1.0.0" },
        },
      ],
    } as const;

    const config = {
      changelog: ["./changelog.ts", {}],
      updateInternalDependencies: "patch",
      ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
        onlyUpdatePeerDependentsWhenOutOfRange: true,
      },
      bumpVersionsWithWorkspaceProtocolOnly: false,
      prettier: false,
      ignore: [],
      privatePackages: { version: false, tag: false },
    } as const;

    const releasePlanRunner = applyReleasePlan as (
      ...arguments_: any[]
    ) => Promise<string[]>;

    const touched = await releasePlanRunner(releasePlan, packages, config);
    expect(Array.isArray(touched)).toBe(true);

    const changelogPath = path.join(packageDir, "CHANGELOG.md");
    const changelog = await readFile(changelogPath, "utf8");

    expect(changelog).toMatchInlineSnapshot(`
      "# pkg-a

      ## 1.1.0

      Add awesome feature

      ### Testing title

      Add awesome feature

      2

      ### Other updates

      - Chore: update docs
      "
    `);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});
