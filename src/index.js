import process from "process";
import cluster from "cluster";
import path from "path";
import shell from "shelljs";
import logFactory from "pino";
import minimist from "minimist";

//#if _DEBUG
import dotenv from "dotenv";
//#endif

import configFactory from "./util/config.js";

//#if _DEBUG
dotenv.config({ path: "res/config.env" });
//#endif

// NOTE: differentiate between positional arguments, and options passed after "--" POSIX separator
const argv = minimist(process.argv.slice(2), { "--": true });
await (async () => {
    let version = argv.v || argv.version;
    if (version || argv.h || argv.help) {
        (await import("./cli/index-cli.js")).default(import.meta.url, version);
        process.exit(0);
    }
})();

// NOTE: must retrieve values after dotenv configured
const config = configFactory(argv);

if (!config.domain) {
    throw "Error: Domain must be set (-d, --domain, SERVER_DOMAIN)";
}

if (!config.authDb) {
    throw "Error: Mongodb address, or yaml file must be set (-D, --db, AUTH_DB)";
}

if (!config.authSecret) {
    throw "Error: 32 characters long secret must be set (-s, --secret, AUTH_SECRET)";
}

let destination = undefined;
if (config.logFile) {
    shell.mkdir("-p", path.dirname(config.logFile));
    destination = logFactory.destination({ dest: config.logFile, sync: false });
}
const rootLogger = logFactory(
    {
        safe: true,
        name: config.id,
        timestamp: config.logTimestamp,
        level: config.logLevel
    },
    destination
);

if (cluster.isPrimary) {
    import("./process/manager.js").then((m) => m.default(config, rootLogger));
} else {
    // NOTE: using `await` broke IPC here
    import("./process/server.js").then((m) => m.default(config, rootLogger));
}
