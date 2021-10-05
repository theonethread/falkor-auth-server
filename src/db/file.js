import yaml from "yaml";
import shell from "shelljs";

export default async (config, logger) => {
    const userData = yaml.parse(shell.cat(config.authDb))?.users;

    return {
        getUserData: async (user) => userData[user]
    };
};
