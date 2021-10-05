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
const retrieveOwnVersion = () =>
    // NOTE: can't use __dirname in es module
    JSON.parse(shell.cat(path.join(path.dirname(fileURLToPath(import.meta.url)), "../package.json"))).version;

if (argv.v || argv.version) {
    console.log("falkor-auth-server version", retrieveOwnVersion());
    process.exit(0);
}

if (argv.h || argv.help) {
    console.log(`
[Falkor Authentication Server]
version ${retrieveOwnVersion()}
(C)2020-2021 Barnabas Bucsy - All rights reserved.

Falkor Nginx authentication preflight proxy server - part of the Falkor Framework

Usage:
    falkor-auth-server (-v | --version | -h | --help)
    falkor-auth-server

Options:
    -v, --version                   Show version and exit
    -h, --help                      Show this screen and exit
    -i <id>, --id <id>              ID of server
    -p <port>, --port <port>        Port of server
    -d <domain>, --domain <domain>  Domain of the cookies to set
    -H <host>, --host <host>        Host of the server
    -c <cookie>, --cookie <cookie>  Cookie name
    -t <ttl>, --ttl <ttl>           Cookie TTL
    -s <secret>, --secret <secret>  Server secret for toke encryption
    -u <user>, --user <user>        User response header name
    -r <role>, --role <role>        Role response header name
    -D <db>, --db <db>              User database, either "mongodb+srv://" address, or relative path to yml file
    -S <stamp>, --stamp <stamp>     Add timestamp to logs
    -l <level>, --level <level>     Log level
    -f <file>, --file <file>        Log file destination
`);
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
