# **Falkor Authentication Server**

[![Npm Keywords](https://img.shields.io/github/package-json/keywords/theonethread/falkor-auth-server "Keywords")](https://www.npmjs.com/package/@falkor/falkor-auth-server "Visit") &nbsp; [![Npm Package](https://img.shields.io/npm/v/@falkor/falkor-auth-server "Npm")](https://www.npmjs.com/package/@falkor/falkor-auth-server "Visit") &nbsp; [![Node Version](https://img.shields.io/node/v/@falkor/falkor-auth-server "Node")](https://nodejs.org/ "Visit") &nbsp; [![Build](https://img.shields.io/github/workflow/status/theonethread/falkor-auth-server/Falkor%20CI%20-%20Release "Build")](https://github.com/theonethread/falkor-auth-server/actions "Visit") &nbsp; [![Security](https://img.shields.io/github/workflow/status/theonethread/falkor-auth-server/Falkor%20CI%20-%20Security?label=security "Security")](https://github.com/theonethread/falkor-auth-server/actions "Visit") &nbsp; [![Activity](https://img.shields.io/github/last-commit/theonethread/falkor-auth-server "Activity")](https://github.com/theonethread/falkor-auth-server "Visit") &nbsp; [![Falkor Bundler](https://img.shields.io/npm/dependency-version/@falkor/falkor-auth-server/dev/@falkor/falkor-bundler "Falkor Bundler")](https://www.npmjs.com/package/@falkor/falkor-bundler "Visit") &nbsp; [![Fastify](https://img.shields.io/npm/dependency-version/@falkor/falkor-auth-server/fastify "Fastify")](https://www.npmjs.com/package/fastify "Visit") &nbsp; [![Snyk Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/theonethread/falkor-auth-server "Snyk")](https://snyk.io/test/github/theonethread/falkor-auth-server "Visit") &nbsp; [![License](https://img.shields.io/npm/l/@falkor/falkor-auth-server "MIT")](https://github.com/theonethread/falkor-auth-server/blob/master/license.txt "Visit")

The `falkor-auth-server` project is a standalone `npm` command-line application written in JavaScript to be used as an Nginx authentication proxy server (mainly to be used with the **Falkor Framework**).

## **Installation**

Install the package globally, so it's available in your `PATH`:

```
$ npm install --global @falkor/falkor-auth-server
```

## **Usage**

### **Command Line Interface**

#### `falkor-auth-server`

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

- `-v` or `--version`: Show version and exit
- `-h` or `--help`: Show help and exit
- `-i <id>` or `--id <id>`: ID of server (default: `falkor-auth`)
- `-p <port>` or `--port <port>`: Port of server (default: `9999`)
- `-d <domain>` or `--domain <domain>`: Domain of the cookies to set
- `-H <host>` or `--host <host>`: Host of the server (default: `0.0.0.0`)
- `-c <cookie>` or `--cookie <cookie>`: Cookie name (default: `@falkor_token`)
- `-t <ttl>` or `--ttl <ttl>`: Cookie TTL (default: `14400`)
- `-s <secret>` or `--secret <secret>`: 32 characters long secret for token and password encryption
- `-u <user>` or `--user <user>`: User response header name (default: `X-Falkor-Header`)
- `-r <role>` or `--role <role>`: Role response header name (default: `X-Falkor-Role`)
- `-D <db>` or `--db <db>`: User database address (`mongodb://` or `mongodb+srv://` address)
- `-S <stamp>` or `--stamp <stamp>`: Add timestamp to logs (default: `true`)
- `-l <level>` or `--level <level>`: Log level (default: `debug`)
- `-f <file>` or `--file <file>`: Log file destination, if set logs will be dumped here

> _**SEE:** [`config.js`](https://github.com/theonethread/falkor-auth-server/blob/master/src/util/config.js "Open") for further reference._

#### `falkor-auth-passwd`

The accompanying `falkor-auth-passwd` binary is also a standalone `npm` command-line application written in JavaScript to be used with the `falkor-auth-server`. It generates hashes out of passwords based on the server's secret to be stored in the database.

Usage:

```
falkor-auth-passwd (--password <password>) (--secret <secret>)
falkor-auth-passwd (-p <password>) (-s <secret>)
falkor-auth-passwd (-v | --version | -h | --help)
```

Options:

`-v` or `--version`: Show version and exit `-h` or `--help`: Show help and exit `-s <secret>` or `--secret <secret>`: 32 characters long secret for token and password encryption `-p <password>` or `--password <password>`: Password to create encrypted hash for

### **Environment Variables**

All `falkor-auth-server` CLI options can be set as environment variables too, though CLI flags overpower them.

- `SERVER_ID=<id>`: ID of server (default: `falkor-auth`)
- `SERVER_PORT=<port>`: Port of server (default: `9999`)
- `SERVER_DOMAIN=<domain>`: Domain of the cookies to set
- `SERVER_HOST=<host>`: Host of the server (default: `0.0.0.0`)
- `COOKIE_NAME=<cookie>`: Cookie name (default: `@falkor_token`)
- `COOKIE_TTL=<ttl>`: Cookie TTL (default: `14400`)
- `AUTH_SECRET=<secret>`: 32 characters long secret for token and password encryption
- `AUTH_HEADER_USER=<user>`: User response header name (default: `X-Falkor-Header`)
- `AUTH_HEADER_ROLE=<role>`: Role response header name (default: `X-Falkor-Role`)
- `AUTH_DB=<db>`: User database address (`mongodb://` or `mongodb+srv://` address)
- `LOG_TIMESTAMP=<stamp>`: Add timestamp to logs (default: `true`)
- `LOG_LEVEL=<level>`: Log level (default: `debug`)
- `LOG_FILE=<file>`: Log file destination, if set logs will be dumped here

> _**SEE:** Example [`config.env`](https://github.com/theonethread/falkor-auth-server/blob/master/res/config.env "Open") for further reference._

### **Must Have Settings**

The following settings must be present either running the application with CLI options, or using environment variables:

- Domain of the cookies to set:
  - `-d <domain>` or `--domain <domain>`
  - `SERVER_DOMAIN=<domain>`
- 16 characters long secret for token encryption:
  - `-s <secret>` or `--secret <secret>`
  - `AUTH_SECRET=<secret>`
- User database address (or relative path to `.yml` file in `debug` builds):
  - `-D <db>` or `--db <db>`
  - `AUTH_DB=<db>`

## **User Data**

The server needs an existing MongoDB database, for testing purposes one can create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas "Visit"). The application will assume the following database setup:

- Database: `authentication`
- Collection: `users`
- Entries:

```javascript
{
    name: { type: "string" }
    pwd: { type: "string" }
    roles: {
        type: "array",
        items: { type: "string" }
    }
}
```

The `pwd` entry must be an encoded password hash. To generate one with the application's `crypto` library, with a global install run:

```
$ falkor-auth-passwd --secret <your-secret> --password <your-password>
```

Or from the installed project's root:

```
$ npm run passwd -- --secret <your-secret> --password <your-password>
```

> _**NOTE:** Since randomization, you will get different values running this command multiple times._

## **Server Setup**

To set up a Fedora-based Nginx webserver using Node.js as authentication service you can follow my tutorials in the Hetzner Community:

- [Setting Up a Secure Fedora Webserver](https://community.hetzner.com/tutorials/secure-fedora-webserver "Visit")
- [Password Protecting Web Content](https://github.com/theonethread/community-content/blob/master/tutorials/nginx-password-protect-content/01.en.md "Visit") _(under review)_

## **Further Development**

The project uses the [`@falkor/falkor-bundler`](https://www.npmjs.com/package/@falkor/falkor-bundler "Visit") module to compile sources. To clone the repository and compile `falkor-auth-server` one can use the commands:

```
$ git clone --branch develop git@github.com:theonethread/falkor-auth-server.git
$ cd falkor-auth-server
$ npm install
$ npm run [ debug | release ]
```

> _**SEE:** `"scripts"` entry in [`package.json`](https://github.com/theonethread/falkor-auth-server/blob/master/package.json "Open") for further reference._

> _**NOTE:** Compiling the `develop` sources might need locally linked `develop` versions of downstream module:_
>
> - _[`@falkor/falkor-bundler`](https://github.com/theonethread/falkor-bundler/tree/develop "Visit")_
>
> _**SEE:** [`npm-link`](https://docs.npmjs.com/cli/v7/commands/npm-link "Visit") for further reference._

### **Database**

If compiled in `debug` mode, and the application finds user data in MongoDB with unencrypted `pass` field (when logging a user in), **it will update the user record** with an encrypted `pwd` field, and unset `pass`. This behavior can be controlled with the `#UPDATE_PWD` context variable in the `"scripts"` block of [`package.json`](https://github.com/theonethread/falkor-auth-server/blob/master/package.json "Open") - for further details see [`@falkor/falkor-bundler`](https://www.npmjs.com/package/@falkor/falkor-bundler "Visit").

#### **Database Mock**

If compiled in `debug` mode and the DB option does not start with `mongodb://` or `mongodb+srv://`, the application will assume a relative path to a `.yml` file with the following structure:

```yaml
users:
  - name: string
    pass: string
    roles: [string]
```

> _**SEE:** Example [`auth.yml`](https://github.com/theonethread/falkor-auth-server/blob/master/res/auth.yml "Open") for further reference._

### **Man Page**

By default the `falkor-auth-server` project ships with pre-compiled man pages when installed on Unix-like operating systems. The manuals were created by converting the files [`man/man.md`](https://github.com/theonethread/falkor-auth-server/blob/master/man/man.md "Open") and [`man/passwd.md`](https://github.com/theonethread/falkor-auth-server/blob/master/man/passwd.md "Open").

To recompile the manuals, make sure that [`Pandoc`](https://pandoc.org/ "Visit") is installed, and present in the `PATH`, then run:

```
$ npm run man
```

### **Linting**

The project uses [`prettier`](https://www.npmjs.com/package/prettier "Visit"), to lint sources and documentation run:

```
$ npm run lint
```

> _**SEE:** [`.prettierrc`](https://github.com/theonethread/falkor-auth-server/blob/develop/.prettierrc "Open") for further reference._

### **Versioning and Branching Strategy**

Release sources can be found on the `master` branch, this one always points to the latest tagged release. Previous sources of releases can be found using Git version tags (or browsing GitHub releases). Released packages can be found on [npmjs](https://www.npmjs.com/package/@falkor/falkor-auth-server "Visit").

The repository's main branch is `develop` (due to technical reasons), this holds all developments that are already decided to be included in the next release. Usually this branch is ahead of `master` one patch version (but based on upcoming features to include this can become minor, or major), so prepared external links may yet be broken.

The `feature/*` branches usually hold ideas and POC code, these will only be merged into `develop` once their impact measured and quality meets release requirements.

> _The project uses [SemVer](https://semver.org "Visit"), Git tags are prefixed with a `v` character._

### **GitHub Actions**

The workflows can be found [here](https://github.com/theonethread/falkor-auth-server/blob/develop/.github/workflows "Open").

#### **Continuous Integration**

Automatic builds are achieved via GitHub actions, CI will make nightly builds of the `develop` branch (using Ubuntu image), and test `master` when there is a pull request, or commit on it (using Ubuntu - Win - MacOS image matrix).

### **Security**

The project uses [CodeQL](https://codeql.github.com "Visit") and [Snyk](https://snyk.io "Visit") to ensure standard security.

> _The **Falkor Framework** supports a healthy and ubiquitous Internet Immune System enabled by security research, reporting, and disclosure. Check out our [Vulnerability Disclosure Policy](https://github.com/theonethread/falkor-auth-server/security/policy "Open") - based on [disclose.io](https://disclose.io "Visit")'s best practices._

### **Free and Open Source**

The latest sources can always be found on [GitHub](https://github.com/theonethread/falkor-auth-server "Visit").

#### **Getting Involved**

We believe - and we hope you do too - that learning how to code, how to think, and how to contribute to free- and open source software can empower the next generation of coders and creators. We **value** first time contributors just the same as rock stars of the OSS world, so if you're interested in getting involved, just head over to our [Contribution Guidelines](https://github.com/theonethread/.github/blob/master/.github/contributing.md "Open") for a quick heads-up!

#### **License**

[MIT](https://github.com/theonethread/falkor-auth-server/blob/master/license.txt "Open")

_©2020-2021 Barnabas Bucsy - All rights reserved._
