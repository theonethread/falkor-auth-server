# **[Falkor] Authentication Server**

```javascript
// Work IN Progress
```

The `falkor-auth-server` project is a standalone npm command-line application written in TypeScript to be used as an nginx authentication proxy server (mainly to be used with the **Falkor Framework**).

## **Installation**

## **Usage**

### **Command Line Interface**

Usage:

```
falkor-auth-server
falkor-auth-server (-v | --version | -h | --help)
```

Options:

* `-v` or `--version`: Show version and exit
* `-h` or `--help`: Show help and exit

### **Man Page**

By default the `falkor-auth-server` project ships with a pre-compiled man page when installed on Unix-like operating systems. The manual was created by converting the file [`man/man.md`](man/man.md "Open").

To recompile the manual, make sure that [`Pandoc`](https://pandoc.org/ "Visit") is installed, and present in the `PATH`, then run:

```
$ npm run man
```

_©2020-2021 Barnabas Bucsy - All rights reserved._
