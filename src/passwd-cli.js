import path from "path";
import { fileURLToPath } from "url";
import shell from "shelljs";

const retrieveOwnVersion = () =>
    // NOTE: can't use __dirname in es module
    JSON.parse(shell.cat(path.join(path.dirname(fileURLToPath(import.meta.url)), "../package.json"))).version;

export default (short = false) => {
    if (short) {
        console.log("falkor-auth-passwd version", retrieveOwnVersion());
        return;
    }

    console.log(`
[Falkor Authentication Passwd Generator]
version ${retrieveOwnVersion()}
(C)2020-2021 Barnabas Bucsy - All rights reserved.

Falkor authentication password hash generator - part of the Falkor Framework

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
};
