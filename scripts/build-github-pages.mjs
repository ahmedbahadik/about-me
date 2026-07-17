import { cp, mkdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const githubPagesUrl = "https://ahmedbahathiq.com/";
const renderUrl = githubPagesUrl;

if (!process.env.npm_execpath) {
  throw new Error("Run this script through npm: npm run build:github");
}

const build = spawnSync(process.execPath, [process.env.npm_execpath, "run", "build"], {
  cwd: projectRoot,
  env: { ...process.env, GITHUB_PAGES: "true" },
  stdio: "inherit",
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

process.env.GITHUB_PAGES = "true";

const workerPath = join(projectRoot, "dist", "server", "index.js");
const workerModule = await import(`${pathToFileURL(workerPath).href}?github-pages`);
const response = await workerModule.default.fetch(
  new Request(renderUrl, {
    headers: {
      accept: "text/html",
      "x-forwarded-host": "ahmedbahathiq.com",
      "x-forwarded-proto": "https",
    },
  }),
);

if (!response.ok) {
  throw new Error(`Unable to render GitHub Pages HTML: ${response.status}`);
}

const html = await response.text();
const requiredText = [
  "/assets/",
  "/ahmed-bahathiq.jpeg",
  "/Ahmed_Bahathiq_CV.pdf",
  "أحمد يوسف عمر باحاذق",
];

for (const value of requiredText) {
  if (!html.includes(value)) {
    throw new Error(`Generated GitHub Pages HTML is missing: ${value}`);
  }
}

const outputDir = join(projectRoot, "github-pages");
await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(join(projectRoot, "dist", "client"), outputDir, { recursive: true });
await unlink(join(outputDir, "_headers")).catch(() => {});
await writeFile(join(outputDir, "index.html"), html, "utf8");
await writeFile(join(outputDir, "404.html"), html, "utf8");
await writeFile(join(outputDir, ".nojekyll"), "", "utf8");

const generatedIndex = await readFile(join(outputDir, "index.html"), "utf8");
if (!generatedIndex.includes(githubPagesUrl)) {
  throw new Error("Generated metadata does not point to the GitHub Pages URL.");
}

console.log(`GitHub Pages bundle created at ${outputDir}`);
