import { MongoClient } from "mongodb";

export default async (config, logger) => {
    const client = new MongoClient(config.authDb, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const userCollection = client.db("authentication").collection("users");

    return {
        getUserData: async (user) => await userCollection.findOne({ user })
    };
};
