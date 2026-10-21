import { constants } from "node:fs";
import { copyFile, readdir } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";

const root = resolve("out");
let copies = 0;

async function finalize(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = join(directory, entry.name);
    if (entry.isDirectory()) await finalize(source);
    else if (entry.isFile() && source.endsWith(".txt")) {
      const parts = relative(root, source).split(sep);
      const segment = parts.findIndex((part) => part.startsWith("__next."));
      if (segment === -1 || segment === parts.length - 1) continue;
      const target = join(root, ...parts.slice(0, segment), parts.slice(segment).join("."));
      try {
        await copyFile(source, target, constants.COPYFILE_EXCL);
        copies++;
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
      }
    }
  }
}

await finalize(root);
console.log(`Static segment filename compatibility: ${copies} flattened copies created.`);