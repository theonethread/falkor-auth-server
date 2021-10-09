import yaml from "yaml";
import shell from "shelljs";

export default async (config, logger) => {
    let userData;
    try {
        userData = yaml.parse(shell.cat(config.authDb))?.users;
    } catch (e) {
        logger.debug(e);
        logger.warn("file module failure");
        return null;
    }

    return {
        mode: "file",
        getUserData: async (user) => userData.find((u) => u.user === user)
    };
};
