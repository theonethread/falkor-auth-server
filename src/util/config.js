import time from "./time.js";

const trueValues = [true, 1, "1", "true", "yes"];
const falseValues = [false, 0, "0", "false", "no"];

export default (argv) => {
    return {
        pid: process.pid,
        startTime: time.sec36(),

        id: argv.i || argv.id || process.env.SERVER_ID || "falkor-auth",
        port: argv.p || argv.port || +process.env.SERVER_PORT || 9999,
        domain: argv.d || argv.domain || process.env.SERVER_DOMAIN,
        host: argv.H || argv.host || process.env.SERVER_HOST || "0.0.0.0",

        cookieName: argv.c || argv.cookie || process.env.COOKIE_NAME || "@falkor_cloud_token",
        cookieTtl: argv.t || argv.ttl || +process.env.COOKIE_TTL || 14400, // sec

        authSecret: argv.s || argv.secret || process.env.AUTH_SECRET || "%-super-secret-%",
        authHeaderUser: argv.u || argv.user || process.env.AUTH_HEADER_USER || "X-Falkor-User",
        authHeaderRole: argv.r || argv.role || process.env.AUTH_HEADER_ROLE || "X-Falkor-Role",
        authDb: argv.D || argv.db || process.env.AUTH_DB,

        logTimestamp: argv.S || argv.stamp || !falseValues.includes(process.env.LOG_TIMESTAMP),
        logLevel: argv.l || argv.level || process.env.LOG_LEVEL || "debug",
        logFile: argv.f || argv.file || process.env.LOG_FILE || null
    };
};
