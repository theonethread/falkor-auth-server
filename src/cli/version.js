import path from "path";
import { fileURLToPath } from "url";
import shell from "shelljs";

// both index.js & passwd.js gets generated to the .dist directory, we walk upwards from there:
export default (fileUrl) =>
    JSON.parse(shell.cat(path.join(path.dirname(fileURLToPath(fileUrl)), "..", "package.json"))).version;
