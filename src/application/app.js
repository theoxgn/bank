const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require('helmet');
const path = require('path');
const logger = require('../../src/helper/log.helper');
require("dotenv").config()

//sementara
app.use(express.static(path.join(__dirname, "../../public")))
// require router
const routerV1 = require('../../src/routes/v1/index');
const routerV2 = require('../../src/routes/v2/index');
const {errorMiddleware} = require("../../src/middleware/error-middleware");

// set app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", async(req, res) => {
    res.json({
        message: "forbidden"
    });
});

app.use((req, res, next) => {
    const originalSend = res.send.bind(res);
    res.send = function (body) {
        const statusCode = res.statusCode;
        if(statusCode === 200 || statusCode === 201) {
            logger.info(`[${req.method}] ${req.originalUrl} - ${req.ip} - ${statusCode}`);
        }
        else {
            logger.error(`[${req.method}] ${req.originalUrl} - ${req.ip} - ${statusCode}`);
        }
        return originalSend(body);
    };
    next();
});

// inisialisasi router
app.use('/v1/', routerV1);
app.use('/v2/', routerV2);

// handle global error with middleware
app.use(errorMiddleware);

/**
 * handle 404 not found
 */
app.use(function(req, res, next) {
    res.status(404)

    if (req.accepts('json')) {
        res.json({ error: 'Not found!!!' })
        return
    }

})

module.exports = app;