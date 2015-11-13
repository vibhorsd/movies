/**
 * Created by pushanmitra on 10/11/15.
 */
import winston from "winston"

//console.log("hi");
winston.loggers.add('default', {
    console: {
        colorize: true,
        label: 'default',
        timestamp: function(){
            return new Date();
        }
    }
});

var defaultLogger = winston.loggers.get('default');

export default defaultLogger;