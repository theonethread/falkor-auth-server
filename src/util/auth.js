import time from "./time.js";
import cryptoFactory from "./crypto.js";

const tokenJoiner = "#";
const roleJoiner = ":";

export default async (config, logger) => {
    const crypto = cryptoFactory(config.authSecret);

    let db;
    if (/^mongodb\+srv:\/\//.test(config.authDb)) {
        const mongoDbModule = await import("../db/mongo.js");
        db = await mongoModule.default(config, logger);
    } else {
        const fileDbModule = await import("../db/file.js");
        db = await fileModule.default(config, logger);
    }

    const getPermissions = async (hostname, user, pass) => {
        if (!user || !pass) {
            return null;
        }

        const u = await db.getUserData(user);
        if (u?.pass === pass) {
            const joinedRoles = u.roles.join(roleJoiner);
            return {
                user,
                role: joinedRoles,
                token: await crypto.encode([config.id, user, joinedRoles, time.sec36()].join(tokenJoiner))
            };
        }

        return null;
    };

    const validateToken = (hostname, token) => {
        if (!token) {
            return null;
        }

        const raw = crypto.decode(token);
        if (!raw) {
            return null;
        }

        const [tokenId, tokenUser, tokenRole, tokenTime] = raw.split(tokenJoiner);
        if (tokenId !== config.id || tokenTime < config.startTime) {
            return null;
        }

        return {
            user: tokenUser,
            role: tokenRole,
            token
        };
    };

    return {
        getPermissions,
        validateToken
    };
};
