import serverFactory from "fastify";
import serverStaticPlugin from "fastify-static";
import serverCookiePlugin from "fastify-cookie";

import routerFactory from "../util/router.js";

export default async (config, rootLogger) => {
    const logger = rootLogger.child({ process: "worker" });
    const router = routerFactory(config, logger);
    const server = serverFactory({
        disableRequestLogging: true,
        logger
    });

    await server.register(serverCookiePlugin);

    if (config.webStaticPath) {
        // const wasmRe = /\.wasm$/;
        await server.register(serverStaticPlugin, {
            root: config.webStaticPath,
            prefix: "/cdn/",
            send: { cacheControl: false },
            setHeaders: (res, path, stat) => {
                res.setHeader("Access-Control-Allow-Origin", "*");
                // if (wasmRe.test(path)) {
                //     res.setHeader("Content-Type", "application/wasm");
                // }
            }
        });
    }

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

    await server.listen(config.port, config.host);
    logger.info({ status: "ready", protocol: "http", host: config.host, port: config.port });

    process.on("message", (message) => {
        logger.info({ message });
    });

    if (process.env.CLUSTER_INIT) {
        process.send({ status: "ready" });
    }
};
