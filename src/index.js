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

const argv = minimist(process.argv.slice(2));
if (argv.v || argv.version) {
    (await import("./index-cli.js")).default(true);
    process.exit(0);
}
if (argv.h || argv.help) {
    (await import("./index-cli.js")).default();
    process.exit(0);
}

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

// TODO: `cluster.isPrimary` in v16
if (cluster.isMaster) {
    import("./process/manager.js").then((m) => m.default(config, rootLogger));
} else {
    // NOTE: using `await` broke IPC here
    import("./process/server.js").then((m) => m.default(config, rootLogger));
}
