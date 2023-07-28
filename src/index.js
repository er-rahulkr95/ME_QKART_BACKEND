const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const winston = require("winston");
const logConfiguration = {
    transports:[new winston.transports.Console()]
}
const logger = winston.createLogger(logConfiguration);

let server;

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port
mongoose.connect(config.mongoose.url,{ useNewUrlParser: true , useUnifiedTopology: true,  useCreateIndex: true }).then(resp=>{
    logger.info("Data base connected at: "+config.mongoose.url)
    app.listen(config.port,()=>{
        logger.info("Backend Started at: " + config.port)
    })
}).catch(err=>{
    logger.info("Something wrong happened", err)
})
