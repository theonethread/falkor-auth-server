import time from "./time.js";
import cryptoFactory from "./crypto.js";

const tokenJoiner = "#";
const roleJoiner = ":";

export default async (config, logger) => {
    let db;
    if (/^mongodb\+srv:\/\//.test(config.authDb)) {
        const mongoDbModule = await import("../db/mongo.js");
        db = await mongoDbModule.default(config, logger);
    } else {
        const fileDbModule = await import("../db/file.js");
        db = await fileDbModule.default(config, logger);
    }

    const crypto = cryptoFactory(config.authSecret);

    const getPermission = async (hostname, user, pass) => {
        if (!user || !pass) {
            return null;
        }

        const u = await db.getUserData(user);
        let valid = false;
        if (db.mode === "file") {
            valid = u?.pass === pass;
        } else {
            //#if _DEBUG
            if (u?.pass) {
                logger.debug({ msg: "updating pwd", user });
                u.pwd = await crypto.encode(u.pass, true);
                u.pwd && (await db.updateUserData(user, u.pwd));
            }
            //#endif
            valid = u?.pwd && crypto.decode(u.pwd, true) === pass;
        }
        if (valid) {
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
        getPermission,
        validateToken
    };
};
