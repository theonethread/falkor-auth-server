% FALKOR-AUTH-PASSWD(1) The Falkor Framework **1.0.0** | **Falkor** General Commands Manual
% Barnabas Bucsy
% October 2021

# NAME

**falkor-auth-passwd** - Falkor password hash generator - part of the **Falkor Framework**

# SYNOPSIS

```
falkor-auth-passwd (--password <password>) (--secret <secret>)
falkor-auth-passwd (-p <password>) (-s <secret>)
falkor-auth-passwd (-v | --version | -h | --help)
```

# DESCRIPTION

The **falkor-auth-passwd** project is a standalone npm command-line application written in JavaScript to be used with the **falkor-auth-server**. It generates hashes out of passwords to be stored in the database.

# OPTIONS

`-v`, `--version`
:   Show version and exit

`-h`, `--help`
:   Show help and exit

`-s`, `--secret`
:   32 characters long secret for token and password encryption

`-p`, `--password`
:   Password to create encrypted hash for

# COPYRIGHT

(C)2020-2021 Barnabas Bucsy - All rights reserved.
