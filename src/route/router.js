import authFactory from "../util/auth.js";

const extend = (base, ...extraParams) => (extraParams ? Object.assign({}, base, ...extraParams) : base);

export default async (config, logger) => {
    const auth = await authFactory(config, logger);
    if (!auth) {
        logger.warn("router module failure");
        return null;
    }

    const defaultCookieOptions = {
        httpOnly: true,
        secure: true,
        domain: config.domain,
        path: "/"
    };
    const defaultSendValues = {
        pid: config.pid,
        id: config.id
    };
    const defaultSendSuccess = { status: "success" };
    const defaultSendFailure = { status: "failure" };

    const getCookieOptions = (...extraParams) => extend(defaultCookieOptions, ...extraParams);
    const getSendValues = (...extraParams) => extend(defaultSendValues, ...extraParams);
    const buildSchema = () => {
        const response200 = {
            type: "object",
            required: ["pid", "id", "status"],
            properties: {
                pid: { type: "integer", const: config.pid },
                id: { type: "string", const: config.id },
                status: { type: "string", const: defaultSendSuccess.status },
                user: { type: "string" },
                role: { type: "string" }
            }
        };
        const response401 = {
            type: "object",
            required: ["pid", "id", "status"],
            properties: {
                pid: { type: "integer", const: config.pid },
                id: { type: "string", const: config.id },
                status: { type: "string", const: defaultSendFailure.status }
            }
        };
        const bodyLogin = {
            type: "object",
            required: ["user", "pass"],
            properties: {
                user: { type: "string" },
                pass: { type: "string" }
            }
        };

        return {
            heartbeat: {
                response: { 200: response200 }
            },
            logout: {
                response: { 200: response200 }
            },
            validate: {
                response: { 200: response200, 401: response401 }
            },
            login: {
                body: bodyLogin,
                response: { 200: response200, 401: response401 }
            }
        };
    };

    const heartbeat = async (request, response) => {
        response.send(getSendValues(defaultSendSuccess));
    };

    const logout = async (request, response) => {
        response
            .clearCookie(config.cookieName, getCookieOptions())
            .header(config.authHeaderUser, "")
            .header(config.authHeaderRole, "")
            .send(getSendValues(defaultSendSuccess));
    };

    const validate = async (request, response) => {
        const permissions = request.cookies && auth.validateToken(request.hostname, request.cookies[config.cookieName]);
        if (permissions) {
            response
                .code(200)
                .header(config.authHeaderUser, permissions.user)
                .header(config.authHeaderRole, permissions.role)
                .send(
                    getSendValues(defaultSendSuccess, {
                        user: permissions.user,
                        role: permissions.role
                    })
                );
        } else {
            request.log.info({
                msg: "validation failure",
                ip: request.ips || request.ip
            });
            response
                .code(401)
                .header(config.authHeaderUser, "")
                .header(config.authHeaderRole, "")
                .clearCookie(config.cookieName, getCookieOptions())
                .send(getSendValues(defaultSendFailure));
        }
    };

    const login = async (request, response) => {
        const permissions = await auth.getPermission(request.hostname, request.body.user, request.body.pass);
        if (permissions) {
            response
                .header(config.authHeaderUser, permissions.user)
                .header(config.authHeaderRole, permissions.role)
                .setCookie(config.cookieName, permissions.token, getCookieOptions({ maxAge: config.cookieTtl }))
                .send(
                    getSendValues(defaultSendSuccess, {
                        user: permissions.user,
                        role: permissions.role
                    })
                );
            return;
        }
        request.log.info({
            msg: "login failure",
            ip: request.ips || request.ip
        });
        response
            .status(401)
            .header(config.authHeaderUser, "")
            .header(config.authHeaderRole, "")
            .clearCookie(config.cookieName, getCookieOptions())
            .send(getSendValues(defaultSendFailure));
    };

    return {
        heartbeat,
        logout,
        validate,
        login,
        schema: buildSchema()
    };
};
