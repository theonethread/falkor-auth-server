import minimist from "minimist";
import cryptoFactory from "./util/crypto.js";

const argv = minimist(process.argv.slice(2));

const retrieveOwnVersion = () =>
    // NOTE: can't use __dirname in es module
    JSON.parse(shell.cat(path.join(path.dirname(fileURLToPath(import.meta.url)), "../package.json"))).version;

if (argv.v || argv.version) {
    console.log("falkor-auth-passwd version", retrieveOwnVersion());
    process.exit(0);
}
if (argv.h || argv.help) {
    console.log(`
[Falkor Authentication Passwd Generator]
version ${retrieveOwnVersion()}
(C)2020-2021 Barnabas Bucsy - All rights reserved.

Falkor authentication passwd generator - part of the Falkor Framework

Usage:
    falkor-auth-passwd (--password <password>) (--secret <secret>)
    falkor-auth-passwd (-p <password>) (-s <secret>)
    falkor-auth-passwd (-v | --version | -h | --help)

Options:
    -v, --version                         Show version and exit
    -h, --help                            Show this screen and exit
    -s <secret>, --secret <secret>        32 characters long secret for token and password encryption
    -p <password>, --password <password>  Password to create encrypted hash for
`);
    process.exit(0);
}

const config = {
    pass: argv.p || argv.password,
    secret: argv.s || argv.secret
};

if (!config.pass) {
    throw "Error: Password must be set (-p, --password)";
}

if (!config.secret) {
    throw "Error: Secret must be set (-s, --secret)";
}

const crypto = cryptoFactory(config.secret);
console.log("passwd:", await crypto.encode(config.pass, true));
