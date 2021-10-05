# **[Falkor] Authentication Server**

```javascript
// Work IN Progress
```

The `falkor-auth-server` project is a standalone npm command-line application written in TypeScript to be used as an nginx authentication proxy server (mainly to be used with the **Falkor Framework**).

## **Installation**

Install the package globally, so it's available in your `PATH`:

```
$ npm install --global "@falkor/falkor-auth-server"
```

## **Usage**

### **Command Line Interface**

Usage:

```
falkor-auth-server [(--id <id>)] [(--port <port>)] [(--domain <domain>)] [(--host <host>)] [(--cookie <cookie>)]
    [(--ttl <ttl>)] [(--secret <secret>)] [(--user <user>)] [(--role <role>)] [(--db <db>)] [(--stamp <stamp>)]
    [(--level <level>)] [(--file <file>)]
falkor-auth-server [(--i <id>)] [(--p <port>)] [(--d <domain>)] [(--H <host>)] [(--c <cookie>)][(--t <ttl>)] 
    [(--s <secret>)] [(--u <user>)] [(--r <role>)] [(--D <db>)] [(--S <stamp>)] [(--l <level>)] [(--f <file>)]
falkor-auth-server (-v | --version | -h | --help)
```

Options:

* `-v` or `--version`: Show version and exit
* `-h` or `--help`: Show help and exit
* `-i <id>` or `--id <id>`: ID of server
* `-p <port>` or `--port <port>`: Port of server
* `-d <domain>` or `--domain <domain>`: Domain of the cookies to set
* `-H <host>` or `--host <host>`: Host of the server
* `-c <cookie>` or `--cookie <cookie>`: Cookie name
* `-t <ttl>` or `--ttl <ttl>`: Cookie TTL
* `-s <secret>` or `--secret <secret>`: Server secret for toke encryption
* `-u <user>` or `--user <user>`: User response header name
* `-r <role>` or `--role <role>`: Role response header name
* `-D <db>` or `--db <db>`: User database, either "mongodb+srv://" address, or relative path to yml file
* `-S <stamp>` or `--stamp <stamp>`: Add timestamp to logs
* `-l <level>` or `--level <level>`: Log level
* `-f <file>` or `--file <file>`: Log file destination

### **Environment Variables**

All CLI options can be set as environment variables too, though CLI flags overpower them.

* `SERVER_ID=<id>`: ID of server
* `SERVER_PORT=<port>`: Port of server
* `SERVER_DOMAIN=<domain>`: Domain of the cookies to set
* `SERVER_HOST=<host>`: Host of the server
* `COOKIE_NAME=<cookie>`: Cookie name
* `COOKIE_TTL=<ttl>`: Cookie TTL
* `AUTH_SECRET=<secret>`: Server secret for toke encryption
* `AUTH_HEADER_USER=<user>`: User response header name
* `AUTH_HEADER_ROLE=<role>`: Role response header name
* `AUTH_DB=<db>`: User database, either "mongodb+srv://" address, or relative path to yml file
* `LOG_TIMESTAMP=<stamp>`: Add timestamp to logs
* `LOG_LEVEL=<level>`: Log level
* `LOG_FILE=<file>`: Log file destination

### **Man Page**

By default the `falkor-auth-server` project ships with a pre-compiled man page when installed on Unix-like operating systems. The manual was created by converting the file [`man/man.md`](man/man.md "Open").

To recompile the manual, make sure that [`Pandoc`](https://pandoc.org/ "Visit") is installed, and present in the `PATH`, then run:

```
$ npm run man
```

_©2020-2021 Barnabas Bucsy - All rights reserved._
