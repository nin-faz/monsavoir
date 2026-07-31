// Next.js 16.2.6 unconditionally enables streaming-metadata during
// `output: "export"` builds (see node_modules/next/dist/export/worker.js),
// leaving an orphan `<div hidden><!--$--><!--/$--></div>` as the first
// child of <body> on every prerendered page. Since the page is fully
// static, that placeholder never resolves — React discards and remounts
// the whole tree on hydration (console error #418) for nothing. Strip it
// after export; safe because the pattern is a fixed, content-free marker.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = fileURLToPath(new URL("../out", import.meta.url));
const PLACEHOLDER = /<div hidden(?:="")?><!--\$--><!--\/\$--><\/div>/g;

const files = (await readdir(OUT_DIR)).filter((f) => f.endsWith(".html"));

for (const file of files) {
  const path = join(OUT_DIR, file);
  const html = await readFile(path, "utf8");
  const stripped = html.replace(PLACEHOLDER, "");
  if (stripped !== html) {
    await writeFile(path, stripped);
    console.log(`stripped metadata placeholder: ${file}`);
  }
}
