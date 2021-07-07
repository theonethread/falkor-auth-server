export default {
    sec36: (d) => Math.floor((d?.getTime() || Date.now()) / 1000).toString(36)
};
