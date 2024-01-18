import app from './src/app.js';
import config from './src/config/server.config.js';

const PORT = config.port;

app.listen(PORT, (re) => {
    console.log(`Server is listening on ${PORT}`);
});
