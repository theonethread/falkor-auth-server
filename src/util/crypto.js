import crypto from "crypto";
import { promisify } from "util";

const randomBytesPromise = promisify(crypto.randomBytes);
const padRe = /=*$/;

// NOTE: we know iv padding length is 1, since data length is 8 bytes
const finalize = (iv, data) => reverse(iv.slice(0, -1) + data.replace(padRe, ""));
const recreateIv = (str) => Buffer.from(str.slice(0, 11) + "=", "base64").toString("hex");
const reverse = (str) => str.split("").reverse().join("");
const recreateData = (str) => {
    let d = str.slice(11);
    if (d.length % 4 > 0) {
        d.padEnd(Math.ceil(d.length / 4) * 4, "=");
    }
    return d;
};

export default (secret) => {
    if (Buffer.from(secret).length !== 16) {
        throw "Crypto: invalid key length, must be 16 characters";
    }

    const encode = async (str) => {
        try {
            const iv = await randomBytesPromise(8);
            const cipher = crypto.createCipheriv("aes-128-cbc", secret, iv.toString("hex"));
            const data = cipher.update(str, "utf8", "base64");
            return finalize(iv.toString("base64"), data + cipher.final("base64"));
        } catch (e) {
            return null;
        }
    };

    const decode = (str) => {
        try {
            str = reverse(str);
            const decipher = crypto.createDecipheriv("aes-128-cbc", secret, recreateIv(str));
            const data = decipher.update(recreateData(str), "base64", "utf8");
            return data + decipher.final("utf8");
        } catch (e) {
            return null;
        }
    };

    return {
        encode,
        decode
    };
};
