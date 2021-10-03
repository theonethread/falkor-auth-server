import time from "./time.js";

const trueValues = [true, 1, "1", "true", "yes"];
const falseValues = [false, 0, "0", "false", "no"];

export default () => {
    return {
        pid: process.pid,
        startTime: time.sec36(),

        id: process.env.SERVER_ID || "falkor-auth",
        port: +process.env.SERVER_PORT || 9999,
        domain: process.env.SERVER_DOMAIN,
        host: process.env.SERVER_HOST || "0.0.0.0",

        cookieName: process.env.COOKIE_NAME || "@falkor_cloud_token",
        cookieTtl: +process.env.COOKIE_TTL || 14400, // sec

        authSecret: process.env.AUTH_SECRET || "%-super-secret-%",
        // authHeaderUser: process.env.AUTH_HEADER_USER || "X-Falkor-User",
        // authHeaderRole: process.env.AUTH_HEADER_ROLE || "X-Falkor-Role",

        logTimestamp: !falseValues.includes(process.env.LOG_TIMESTAMP),
        logLevel: process.env.LOG_LEVEL || "debug",
        logFile: process.env.LOG_FILE || null
    };
};
