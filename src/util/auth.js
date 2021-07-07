import yaml from "yaml";
import shell from "shelljs";

import time from "./time.js";
import cryptoFactory from "./crypto.js";

const tokenJoiner = "#";
const roleJoiner = ":";

export default (config, logger) => {
    const crypto = cryptoFactory(config.authSecret);
    const users = yaml.parse(shell.cat("res/auth.yml"))?.users;

    const getPermissions = async (body) => {
        if (body?.user && body?.pass) {
            const u = users[body.user];
            if (u?.pass === body.pass) {
                const joinedRoles = u.roles.join(roleJoiner);
                return {
                    user: body.user,
                    role: joinedRoles,
                    token: await crypto.encode([config.id, body.user, joinedRoles, time.sec36()].join(tokenJoiner))
                };
            }
        }
        return null;
    };

    const validateToken = (token) => {
        if (!token) {
            return null;
        }

        const raw = crypto.decode(token);
        if (!raw) {
            return null;
        }

        const [tokenId, tokenUser, tokenRoles, tokenTime] = raw.split(tokenJoiner);
        if (tokenId !== config.id || tokenTime < config.startTime) {
            return null;
        }
        return {
            user: tokenUser,
            role: tokenRoles,
            token
        };
    };

    return {
        getPermissions,
        validateToken
    };
};
