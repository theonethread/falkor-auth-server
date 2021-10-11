import version from "./version.js";

export default (short = false) => {
    if (short) {
        console.log("falkor-auth-server version", version());
        return;
    }

    console.log(`
[Falkor Authentication Server]
version ${version()}
(C)2020-2021 Barnabas Bucsy - All rights reserved.

Falkor Nginx authentication preflight proxy server - part of the Falkor Framework

Usage:
    falkor-auth-server [(--id <id>)] [(--port <port>)] [(--domain <domain>)] [(--host <host>)] [(--cookie <cookie>)]
        [(--ttl <ttl>)] [(--secret <secret>)] [(--user <user>)] [(--role <role>)] [(--db <db>)] [(--stamp <stamp>)]
        [(--level <level>)] [(--file <file>)]
    falkor-auth-server [(-i <id>)] [(-p <port>)] [(-d <domain>)] [(-H <host>)] [(-c <cookie>)][(-t <ttl>)] 
        [(-s <secret>)] [(-u <user>)] [(-r <role>)] [(-D <db>)] [(-S <stamp>)] [(-l <level>)] [(-f <file>)]
    falkor-auth-server (-v | --version | -h | --help)

Options:
    -v, --version                   Show version and exit
    -h, --help                      Show this screen and exit
    -i <id>, --id <id>              ID of server  [default: falkor-auth]
    -p <port>, --port <port>        Port of server  [default: 9999]
    -d <domain>, --domain <domain>  Domain of the cookies to set
    -H <host>, --host <host>        Host of the server  [default: 0.0.0.0]
    -c <cookie>, --cookie <cookie>  Cookie name  [default: @falkor_token]
    -t <ttl>, --ttl <ttl>           Cookie TTL  [default: 14400]
    -s <secret>, --secret <secret>  32 characters long secret for token and password encryption
    -u <user>, --user <user>        User response header name  [default: X-Falkor-User]
    -r <role>, --role <role>        Role response header name  [default: X-Falkor-Role]
    -D <db>, --db <db>              User database, either "mongodb+srv://" address, or relative path to .yml file
    -S <stamp>, --stamp <stamp>     Add timestamp to logs  [default: true]
    -l <level>, --level <level>     Log level  [default: debug]
    -f <file>, --file <file>        Log file destination, if set logs will be dumped here
`);
};
