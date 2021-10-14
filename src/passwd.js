import minimist from "minimist";
import cryptoFactory from "./util/crypto.js";

const argv = minimist(process.argv.slice(2));
if (argv.v || argv.version) {
    (await import("./cli/passwd-cli.js")).default(true);
    process.exit(0);
}
if (argv.h || argv.help) {
    (await import("./cli/passwd-cli.js")).default();
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
