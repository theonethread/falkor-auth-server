import os from "os";
import cluster from "cluster";

export default (config, rootLogger) => {
    const logger = rootLogger.child({ process: "master" });
    logger.debug({ config });

    const cpuCount = os.cpus().length;
    const processCount = Math.max(1, Math.floor(cpuCount / 2));
    const workers = {};
    let onlineCount = 0;

    const propagate = (msg, wPid) => {
        if (msg.status === "propagate") {
            for (const [p, w] of Object.entries(workers)) {
                if (wPid !== p) {
                    w.send(msg);
                }
            }
        }
    };

    const spawn = (init = false) => {
        const w = cluster.fork({ CLUSTER_INIT: init });
        const wPid = w.process.pid.toString();
        workers[wPid] = w;

        if (init) {
            w.once("message", (msg) => {
                if (init && msg.status === "ready" && onlineCount < processCount) {
                    onlineCount++;
                    if (onlineCount === processCount) {
                        logger.info({ status: "ready" });
                        //#if _LOCAL
                        // NOTE: this will notify VSCode on stdout that the initialization is
                        // finished, and it can carry on with its current launch configuration
                        console.log("[falkor-auth-server] ready");
                        //#endif
                    }
                }
                w.on("message", (msg) => propagate(msg, wPid));
            });
        } else {
            w.on("message", (msg) => propagate(msg, wPid));
        }
    };

    process.once("SIGINT", () => {
        logger.warn({ signal: "SIGINT" });
        cluster.removeAllListeners();
    });

    process.once("SIGTERM", () => {
        logger.warn({ signal: "SIGTERM" });
        cluster.removeAllListeners();
    });

    cluster.on("exit", (worker, code, signal) => {
        const wPid = worker.process.pid.toString();
        logger.warn({
            status: "worker-exit",
            pid: wPid,
            code: code,
            signal: signal
        });
        delete workers[wPid];
        spawn();
    });

    cluster.on("online", (worker) => {
        logger.info({
            status: "worker-online",
            pid: worker.process.pid
        });
    });

    logger.info({
        status: "init",
        cpu: cpuCount,
        fork: processCount
    });
    for (let i = 0; i < processCount; i++) {
        spawn(true);
    }
};
