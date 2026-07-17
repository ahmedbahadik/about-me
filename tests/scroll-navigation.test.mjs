import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("anchor navigation keeps the document as the only scroll container", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const html = css.match(/html\s*\{([^}]*)\}/)?.[1] ?? "";
  const body = css.match(/body\s*\{([^}]*)\}/)?.[1] ?? "";
  const siteShell = css.match(/\.site-shell\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(html, /overflow-x:\s*clip\s*;/);
  assert.match(body, /overflow-x:\s*clip\s*;/);
  assert.doesNotMatch(css, /scroll-behavior:\s*smooth\s*;/);
  assert.doesNotMatch(siteShell, /overflow(?:-x|-y)?:/);
  assert.doesNotMatch(body, /overflow-x:\s*hidden\s*;/);
  assert.match(page, /event\.preventDefault\(\)/);
  assert.match(page, /event\.stopPropagation\(\)/);
  assert.match(page, /window\.history\.replaceState/);
  assert.match(page, /window\.scrollTo\(\{ top, left: 0, behavior: "auto" \}\)/);
});
