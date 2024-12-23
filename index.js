require("dotenv").config()
const logger = require("./src/helper/log.helper");
const port = process.env.PORT
const host = '0.0.0.0'
const app = require('./src/application/app');

app.listen(port, host, () => {
    logger.info(`Server is running on http://${host}:${port}`);
});