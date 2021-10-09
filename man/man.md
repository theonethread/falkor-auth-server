% FALKOR-AUTH-SERVER(1) The Falkor Framework **1.0.0** | **Falkor** General Commands Manual
% Barnabas Bucsy
% October 2021

# NAME

**falkor-auth-server** - Falkor Nginx authentication preflight proxy server - part of the **Falkor Framework**

# SYNOPSIS

```
falkor-auth-server [(--id <id>)] [(--port <port>)] [(--domain <domain>)] [(--host <host>)] [(--cookie <cookie>)]
    [(--ttl <ttl>)] [(--secret <secret>)] [(--user <user>)] [(--role <role>)] [(--db <db>)] [(--stamp <stamp>)]
    [(--level <level>)] [(--file <file>)]
falkor-auth-server [(-i <id>)] [(-p <port>)] [(-d <domain>)] [(-H <host>)] [(-c <cookie>)][(-t <ttl>)] 
    [(-s <secret>)] [(-u <user>)] [(-r <role>)] [(-D <db>)] [(-S <stamp>)] [(-l <level>)] [(-f <file>)]
falkor-auth-server (-v | --version | -h | --help)
```

# DESCRIPTION

The **falkor-auth-server** project is a standalone npm command-line application written in JavaScript to be used as an nginx authentication proxy server (mainly to be used with the **Falkor Framework**).

# OPTIONS

`-v`, `--version`
:   Show version and exit

`-h`, `--help`
:   Show help and exit

`-i <id>`, `--id <id>`
:   ID of server  (default: **falkor-auth**)

`-p <port>`, `--port <port>`
:   Port of server  (default: **9999**)

`-d <domain>`, `--domain <domain>`
:   Domain of the cookies to set

`-H <host>`, `--host <host>`
:   Host of the server  (default: **0.0.0.0**)

`-c <cookie>`, `--cookie <cookie>`
:   Cookie name  (default: **@falkor_token**)

`-t <ttl>`, `--ttl <ttl>`
:   Cookie TTL  (default: **14400**)

`-s <secret>`, `--secret <secret>`
:   32 characters long secret for token and password encryption

`-u <user>`, `--user <user>`
:   User response header name  (default: **X-Falkor-User**)

`-r <role>`, `--role <role>`
:   Role response header name  (default: **X-Falkor-Role**)

`-D <db>`, `--db <db>`
:   User database, either "mongodb+srv://" address, or relative path to **.yml** file

`-S <stamp>`, `--stamp <stamp>`
:   Add timestamp to logs  (default: **true**)

`-l <level>`, `--level <level>`
:   Log level  (default: **debug**)

`-f <file>`, `--file <file>`
:   Log file destination, if set logs will be dumped here

# COPYRIGHT

(C)2020-2021 Barnabas Bucsy - All rights reserved.
