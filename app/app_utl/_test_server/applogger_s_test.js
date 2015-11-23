/**
 * Created by pushanmitra on 13/11/15.
 */
var assert = require("assert");
import app_utl from "../../app_utl"
var logger = app_utl.logger;

describe("Applogger unit test", function(){
    it("shoud log info", function(){
        logger.info("Info logs");
    });
    it("shoud log error", function(){
        logger.error("Error log");
    });
});

