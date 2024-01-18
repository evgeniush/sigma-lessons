const logs = {};

const logger = (req, res, next) => {
    const start = new Date().toISOString();
    const { method, hostname, path } = req ?? {};
    logs.req = ['Request: ', method, hostname, path, start]
        .filter(Boolean)
        .join(' ');
    const originalSend = res.send;
    res.send = function (content) {
        const time = new Date().toISOString();
        logs.res = ['Response: ', res.statusCode, res.statusMessage, time]
            .filter(Boolean)
            .join(' ');
        [logs.req, logs.res].forEach((log) => console.log(log));
        originalSend.call(this, content);
    };
    next();
};

export default logger;
