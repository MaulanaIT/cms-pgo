/**
 * Configurations of logger.
 */
const winston = require('winston');
const fs = require('fs');
// var util = require('util');

const logDir = 'logs';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}


const successLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json()
  ),
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      colorize: true,
      level: "info",
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/%DATE%-results.log`,
      datePattern: 'YYYY-MM-DD',
      prepend: true,
      level: "info"
    })
  ]
});


const errorLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json()
  ),
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      colorize: true,
      level: "error"
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/%DATE%-error.log`,
      datePattern: 'YYYY-MM-DD',
      prepend: true,
      level: "error"
    })
  ]
});

errorLogger.remove(winston.transports.Console);
successLogger.remove(winston.transports.Console);


// function formatArgs(args) {
//   return [util.format.apply(util.format, Array.prototype.slice.call(args))];
// }

//  console.log = function(){
//    successLogger.info.apply(successLogger, formatArgs(arguments));
//  };

//  console.error = function(){
//    errorLogger.error.apply(errorLogger, formatArgs(arguments));
//  };


module.exports = {
  'successlog': successLogger,
  'errorlog': errorLogger
};