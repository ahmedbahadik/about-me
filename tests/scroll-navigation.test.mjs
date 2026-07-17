import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("anchor navigation does not create a locked inner scroll container", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const siteShell = css.match(/\.site-shell\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(siteShell, /overflow:\s*clip\s*;/);
  assert.doesNotMatch(siteShell, /overflow:\s*hidden\s*;/);
});
