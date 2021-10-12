import { MongoClient } from "mongodb";

export default async (config, logger) => {
    const client = new MongoClient(config.authDb, { useNewUrlParser: true, useUnifiedTopology: true });
    let userCollection;
    try {
        await client.connect();
        userCollection = client.db("authentication").collection("users");
    } catch (e) {
        logger.debug(e);
        logger.warn("mongo module failure");
        return null;
    }

    return {
        mode: "mongo",
        //#if _UPDATE_PWD
        updateUserData: async (user, pwd) =>
            await userCollection.updateOne(
                { user },
                {
                    $set: { pwd },
                    $unset: { pass: "" }
                }
            ),
        //#endif
        getUserData: async (user) => await userCollection.findOne({ user })
    };
};
