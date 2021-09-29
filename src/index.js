import cluster from "cluster";
import path from "path";
import shell from "shelljs";
import logFactory from "pino";

//#if _DEBUG
import dotenv from "dotenv";
//#endif

import configFactory from "./util/config.js";
import managerProcess from "./process/manager.js";
import serverProcess from "./process/server.js";

//#if _DEBUG
dotenv.config({ path: "res/config.env" });
//#endif

// NOTE: must retrieve values after dotenv configured
const config = configFactory();

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
cluster.isMaster ? managerProcess(config, rootLogger) : serverProcess(config, rootLogger);
