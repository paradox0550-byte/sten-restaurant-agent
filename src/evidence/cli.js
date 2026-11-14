import fs from "node:fs";
import { validateRegistry } from "./validate.js";
const path = new URL("../../knowledge/evidence/registry.json", import.meta.url);
const result = validateRegistry(JSON.parse(fs.readFileSync(path,"utf8")));
console.log(JSON.stringify(result,null,2));
if (!result.valid) process.exitCode=1;
