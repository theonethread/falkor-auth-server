import time from "./time.js";
import cryptoFactory from "./crypto.js";

const tokenJoiner = "#";
const roleJoiner = ":";

export default async (config, rootLogger) => {
    let db;
    let crypto;

    //#if _DEBUG
    if (/^mongodb(\+srv)?:\/\//.test(config.authDb)) {
        //#endif
        const mongoDbModule = await import("../db/mongo.js");
        db = await mongoDbModule.default(config, rootLogger);
        //#if _DEBUG
    } else {
        const fileDbModule = await import("../db/file.js");
        db = await fileDbModule.default(config, rootLogger);
    }
    //#endif

    if (!db) {
        rootLogger.warn("auth module db failure");
        return null;
    }

    try {
        crypto = cryptoFactory(config.authSecret);
    } catch (e) {
        logger.debug(e);
        rootLogger.warn("auth module crypto failure");
        return null;
    }

    const getPermission = async (hostname, user, pass) => {
        if (!user || !pass) {
            return null;
        }

        const u = await db.getUserData(user);
        let valid = false;
        //#if _DEBUG
        if (db.mode === "file") {
            valid = u?.pass === pass;
        } else {
            //#endif
            //#if _UPDATE_PWD
            if (u?.pass) {
                rootLogger.debug({ msg: "updating pwd", user });
                u.pwd = await crypto.encode(u.pass, true);
                u.pwd && (await db.updateUserData(user, u.pwd));
            }
            //#endif
            valid = u?.pwd && crypto.decode(u.pwd, true) === pass;
            //#if _DEBUG
        }
        //#endif
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
