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
    falkor-auth-server [(--id <id>)] [(--port <port>)] [(--domain <domain>)] [(--host <host>)] [(--cookie <cookie>)]
        [(--ttl <ttl>)] [(--secret <secret>)] [(--user <user>)] [(--role <role>)] [(--db <db>)] [(--stamp <stamp>)]
        [(--level <level>)] [(--file <file>)]
    falkor-auth-server [(--i <id>)] [(--p <port>)] [(--d <domain>)] [(--H <host>)] [(--c <cookie>)][(--t <ttl>)] 
        [(--s <secret>)] [(--u <user>)] [(--r <role>)] [(--D <db>)] [(--S <stamp>)] [(--l <level>)] [(--f <file>)]
    falkor-auth-server (-v | --version | -h | --help)

Options:
    -v, --version                   Show version and exit
    -h, --help                      Show this screen and exit
    -i <id>, --id <id>              ID of server  [default: falkor-auth]
    -p <port>, --port <port>        Port of server  [default: 9999]
    -d <domain>, --domain <domain>  Domain of the cookies to set
    -H <host>, --host <host>        Host of the server  [default: 0.0.0.0]
    -c <cookie>, --cookie <cookie>  Cookie name  [default: @falkor_cloud_token]
    -t <ttl>, --ttl <ttl>           Cookie TTL  [default: 14400]
    -s <secret>, --secret <secret>  16 characters long secret for token encryption
    -u <user>, --user <user>        User response header name  [default: X-Falkor-User]
    -r <role>, --role <role>        Role response header name  [default: X-Falkor-Role]
    -D <db>, --db <db>              User database, either "mongodb+srv://" address, or relative path to .yml file
    -S <stamp>, --stamp <stamp>     Add timestamp to logs  [default: true]
    -l <level>, --level <level>     Log level  [default: debug]
    -f <file>, --file <file>        Log file destination, if set logs will be dumped here
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

if (!config.authSecret) {
    throw "Error: 16 characters long secret must be set (-s, --secret, AUTH_SECRET)";
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
