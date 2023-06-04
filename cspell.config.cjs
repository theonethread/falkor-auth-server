/** @type { import("cspell").CSpellSettings } */
const baseConfig = require("@falkor/falkor-cspell-config");
baseConfig.words.push(
    "fastify",
    "pino",
    "unencrypted",
    "referer",
    "sendfile",
    "nopush",
    "nodelay",
    "keepalive",
    "proto",
    "eecdh",
    "aesgcm",
    "letsencrypt",
    "fullchain",
    "privkey",
    "webserver"
);
module.exports = baseConfig;
