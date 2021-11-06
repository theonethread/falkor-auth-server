import path from "path";
import { fileURLToPath } from "url";
import shell from "shelljs";

export default (fileUrl) =>
    JSON.parse(shell.cat(path.join(path.dirname(fileURLToPath(fileUrl)), "..", "package.json"))).version;
