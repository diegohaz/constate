import type {
  ChangelogFunctions,
  ModCompWithPackage,
  NewChangesetWithCommit,
} from "@changesets/types";

function isOverviewLine(line: string) {
  return line.startsWith("### Overview\n");
}

function isHeadingLine(line: string) {
  return line.startsWith("###");
}

function isOtherLine(line: string) {
  return !line.startsWith("###");
}

async function getDependencyReleaseLine(
  _: NewChangesetWithCommit[],
  dependenciesUpdated: ModCompWithPackage[],
) {
  if (dependenciesUpdated.length === 0) return "";

  const updatedDependenciesList = dependenciesUpdated.map(
    (dependency) => `\`${dependency.name}@${dependency.newVersion}\``,
  );

  return `- Updated dependencies: ${updatedDependenciesList.join(", ")}`;
}

async function getReleaseLine(changeset: NewChangesetWithCommit) {
  const [firstLine, ...nextLines] = changeset.summary
    .split("\n")
    .map((line) => line.trimEnd());

  if (!nextLines.length) {
    return `- ${firstLine}`;
  }

  return `### ${firstLine}\n${nextLines.join("\n")}`;
}

async function getChangelogText(changelogLines: Array<Promise<string>>) {
  const lines = await Promise.all(changelogLines);
  if (!lines.length) return "";

  const overviewLines = lines
    .filter(isOverviewLine)
    .map((line) => line.replace("### Overview\n\n", ""));
  const nonOverviewHeadingLines = lines
    .filter((line) => isHeadingLine(line) && !isOverviewLine(line))
    .map((line) => line.replace("### Overview\n\n", ""));
  const headingLines = [...overviewLines, ...nonOverviewHeadingLines];

  const otherLines = lines.filter(isOtherLine);
  if (!headingLines.length && !otherLines.length) return "";

  const other = otherLines.join("\n");
  if (!headingLines.length) {
    return other;
  }

  const heading = headingLines.join("\n\n");
  if (!other.trim()) {
    return heading;
  }

  return `${heading}\n\n### Other updates\n\n${other}`;
}

type ChangelogLines = Record<
  "major" | "minor" | "patch",
  Array<Promise<string>>
>;

export async function getChangelogEntry(
  release: ModCompWithPackage,
  changelogLines: ChangelogLines,
) {
  const text = await getChangelogText(Object.values(changelogLines).flat());
  return `## ${release.newVersion}\n\n${text}`;
}

export { getDependencyReleaseLine, getReleaseLine };

const changelog: ChangelogFunctions & {
  getChangelogEntry: typeof getChangelogEntry;
} = {
  getDependencyReleaseLine,
  getReleaseLine,
  getChangelogEntry,
};

export default changelog;
