import serverFactory from "fastify";
import serverCookiePlugin from "@fastify/cookie";

import routerFactory from "../route/router.js";

export default async (config, rootLogger) => {
    const logger = rootLogger.child({ process: "worker" });
    const router = await routerFactory(config, logger);
    if (!router) {
        logger.warn("server module failure");
        if (process.env.CLUSTER_INIT) {
            process.send({ status: "failure" });
        }
        return null;
    }

    const server = serverFactory({
        disableRequestLogging: true,
        logger
    });

    await server.register(serverCookiePlugin);

    server.route({
        method: "GET",
        url: "/api/v1",
        handler: router.heartbeat,
        schema: router.schema.heartbeat
    });

    server.route({
        method: "GET",
        url: "/api/v1/logout",
        handler: router.logout,
        schema: router.schema.logout
    });

    server.route({
        method: "GET",
        url: "/api/v1/validate",
        handler: router.validate,
        schema: router.schema.validate
    });

    server.route({
        method: "POST",
        url: "/api/v1/login",
        handler: router.login,
        schema: router.schema.login
    });

    await server.listen({ port: config.port, host: config.host });
    logger.info({ status: "ready", protocol: "http", host: config.host, port: config.port });

    process.on("message", (message) => {
        logger.info({ message });
    });

    if (process.env.CLUSTER_INIT) {
        process.send({ status: "ready" });
    }
};
