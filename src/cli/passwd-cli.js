import getOwnVersion from "./version.js";

export default (fileUrl, short = false) => {
    if (short) {
        console.log("falkor-auth-passwd version", getOwnVersion(fileUrl));
        return;
    }

    console.log(`
[Falkor Authentication Passwd Generator]
version ${getOwnVersion(fileUrl)}
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
