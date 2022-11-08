import { AbsoluteFilePath, join, RelativeFilePath } from "@fern-api/core-utils";
import { itFernETE } from "@fern-typescript/testing-utils";
import { generateClientProject } from "../generateClientProject";

const FIXTURES_DIR = join(AbsoluteFilePath.of(__dirname), RelativeFilePath.of("fixtures"));
const FIXTURES = ["posts", "no-errors", "chat", "auth"].map(RelativeFilePath.of);

// eslint-disable-next-line jest/no-disabled-tests
describe.skip("generateClientProject", () => {
    for (const fixture of FIXTURES) {
        itFernETE(fixture, {
            testFile: AbsoluteFilePath.of(__filename),
            pathToFixture: join(FIXTURES_DIR, "fern", fixture),
            generateFiles: async ({ volume, intermediateRepresentation }) => {
                await generateClientProject({
                    packageName: fixture,
                    packageVersion: "0.0.0",
                    volume,
                    intermediateRepresentation,
                });
            },
        });
    }
});
