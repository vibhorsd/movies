import redis from "redis";
import bluebird from "bluebird";
import setting from "./setting";
import EventEmitter  from "events";
import logger from "../logger";

var env = process.env.NODE_ENV || "development";
var run_env = process.env.RUN_ENV || "local";

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

class CacheManager extends EventEmitter {
    constructor() {
        super();
        this.errors = {
            
        };
        this._redisClient = null;
        this.server = setting.servers[run_env];
        this.db = setting.db[env];
        this.STATUS = {
            Connected : "connected",
            Connecting : "connecting",
            Disconnected : "disconnected",
            Disconnecting : "disconnecting",
            Error : "error"
        }
        this._status = this.STATUS.Disconnected;
        this.keyInfo = "AppInfo";
    }
    
    // Redis key
    _getRedisKey (key) {
        if (key) {
            return setting.info.prefix + ":" + key;
        }
        else {
            throw Error("Invalid key");
        }
        
    }
    _getMapKey (key) {
        if (key) {
            return setting.info.prefix + ":" + key + ":hmap";
        }
        else {
            throw Error("Invalid key");
        }
    }
    
    // Coonecting to redis server
    connect () {
        this._status = this.STATUS.Connecting;
        return new Promise((resolve, reject)  => {
            
            this._redisClient = redis.createClient(this.server.port, this.server.host);
            this._redisClient.on("connect", () => {
                this._status = this.STATUS.Connected;
                // Now set data base command
                this._redisClient.selectAsync(this.db).then((value) => {
                    // Read app info from redis.
                    var redisKey = this._getRedisKey(this.keyInfo);
                    this._redisClient.hgetallAsync(redisKey).then((value) => {
                        if (value) {
                            if (setting.info.version === value.version) {
                                logger.info("[Cache]: Redis App info is same as last one");
                                resolve();
                            }
                            else {
                                this._redisClient.flushdbAsync().then((OK) => {
                                    var info = Object.assign({}, setting.info, {
                                        date : new Date().toString()
                                    });
                                    // Logging
                                    logger.info("[Cache]: Flushed old info: setting new one");
                                    logger.info("[Cache]: Old :" + JSON.stringify(value));
                                    logger.info("[Cache]: New :" + JSON.stringify(info));
                                    
                                    // Saving
                                    this._redisClient.hmsetAsync(redisKey,info).then(() => {
                                        resolve();
                                    }).catch((err) => {
                                        logger.error("[Cache]: Set App info DB Error(2):" + err);
                                        reject(err);
                                    });
                                    
                                }).catch((err) => {
                                    logger.error("[Cache]: flush DB Error:" + err);
                                    reject(err);
                                });
                            }
                        }
                        else {
                            var info = Object.assign({}, setting.info, {
                                date : new Date().toString()
                            });
                            logger.info("[Cache]: New App Info :" + JSON.stringify(info));
                            this._redisClient.hmsetAsync(redisKey, info).then((value) => {
                                resolve();
                            }).catch((err) => {
                                logger.error("[Cache]: Set App info DB Error(1):" + err);
                                reject(err);
                            });
                        }
                    }).catch((err) => {
                        logger.error("[Cache]: Read App info DB Error:" + err);
                        reject(err);
                    });
                    
                }).catch((err) => {
                    logger.error("[Cache]: Select DB Error:" + err);
                    reject(err);
                });
                
            });
            this._redisClient.on("error", (error) => {
                if (this._status === this.STATUS.Connecting){
                    this._status = this.STATUS.Disconnected;
                    reject(error);
                }
                else {
                    this._status = this.STATUS.Error;
                    logger.error("[Cache]: Redis Error");
                }
            });
        });
    }
    
    // Getting app info on redis
    getRedisAppInfo (){
        return this._redisClient.hgetallAsync(this._getRedisKey(this.keyInfo));
    }
    
    // Adding key to redis
    add (key, object, expiry) {
        return new Promise((resolve, reject) => {
            if (key && object && expiry && typeof expiry === "number") {
                var redisKey = this._getRedisKey(key);
                var data = JSON.stringify({value: object});
                this._redisClient.setexAsync(redisKey, expiry, data).then(() => {
                    resolve();
                }).catch((err) => {
                    logger.error("[CacheManager]:(add): Error:Redis Error:" + err);
                    reject(err);
                });
            }
            else {
                logger.error("[CacheManager]:(add): Error:Input");
                reject(new Error("Invalid input"));
            }
        });
    }
    
    // Getting key from redis
    get (key) {
        return new Promise((resolve, reject) => {
            var redisKey = this._getRedisKey(key);
            this._redisClient.getAsync(redisKey).then((value) => {
                if (value) {
                    var data = JSON.parse(value);
                    if (data.value) {
                        resolve(data.value, key);
                    }
                    else {
                        resolve(null);
                    }
                }
                else {
                    resolve(null);
                }
            }).catch((err) => {
                logger.error("[CacheManager]:(get): Error:Redis Error:" + err);
                reject(err);
            });
        });
    }
    
    // Remove
    remove (keys) {
        var newKeys = keys.map((key) => {
            return this._getRedisKey(key);
        });
        return this._redisClient.delAsync(newKeys);
    }
    
    
    _scan (cmd,key, args) {
        return new Promise((resolve, reject) => {
            var allResult = [];
            
            // Recursive scan function.
            var searchLocal = (index)=> {
                var finalArgs = [key,index].concat(args);
                //console.dir(finalArgs);
                this._redisClient.send_command(cmd, finalArgs, (err, result) => {
                    if (err) {
                        logger.error("[CacheManager]:(_scan):Redis Error:" + err + ", index:" + index + ", cmd:" + cmd);
                        logger.info("args:" + JSON.stringify(finalArgs));
                        reject(err);
                    }
                    else {
                        var next = result[0];
                        allResult = allResult.concat(result[1]);
                        //console.log("**** RESULT ****");
                        //console.dir(result[1]);
                        
                        if (next === '0') {
                            resolve(allResult);
                        }
                        else {
                            searchLocal(next);
                        }
                    }
                });
            };
            
            // Starting scane
            searchLocal('0');
        });
    }
    
    // Search
    search (pattern) {
        return new Promise((resolve, reject) => {
            var allResult = [];
            var searchLocal = (index)=> {
                this._redisClient.send_command("SCAN", [index, "MATCH", pattern], (err, result) => {
                    if (err) {
                        logger.error("[CacheManager]:(search):Redis Error:" + err + ", index:" + index + ", pttn:" + pattern);
                        resolve(err);
                    }
                    else {
                        var next = result[0];
                        allResult = allResult.concat(result[1]);
                        //console.log("**** RESULT ****");
                        //console.dir(allResult);
                        
                        if (next === '0') {
                            var finalResult = allResult.map((entry) => {
                                var prefix = setting.info.prefix + ":";
                                return entry.split(prefix)[1];
                            });
                            
                            resolve(finalResult, pattern);
                        }
                        else {
                            searchLocal(next);
                        }
                    }
                });
            };
            
            searchLocal('0');
        });
    }
    
    addMap (key, object, expire) {
        if (key && object && expire && Object.keys(object).length > 0 && typeof expire === 'number') {
            for (let k in object) {
                if (object.hasOwnProperty(k)) {
                    var type = typeof object[k];
                    if (type !== "string") {
                        throw Error("Invalid Entry");
                    }
                }
            }
            var redisKey = this._getRedisKey(key);
            var multi = this._redisClient.multi();
            multi.hmsetAsync(redisKey, object);
            multi.expire(redisKey, expire);
            return multi.execAsync();
        }
        else {
            throw Error("Invalid input");
        }
    }
    
    getMap(key, insideKeys) {
        var redisKey = this._getRedisKey(key);
        if (insideKeys && insideKeys.length > 0) {
            return new Promise((resolve, reject) => {
                var multi = this._redisClient.multi();
                insideKeys.forEach((k) => {
                    multi.hget(redisKey, k);
                });
                multi.execAsync().then((value) => {
                    if (value && value.length === insideKeys.length) {
                        var result = {};
                        for (var idx in insideKeys) {
                            var k = insideKeys[idx];
                            var v = value[idx];
                            result[k] = v;
                        }
                        resolve(result);
                    }
                    else {
                        resolve(null);
                    }
                }).catch((err) => {
                    logger.error("[CacheManager]:(getMap): Error:Redis Error:" + err);
                    reject(err);
                });
            });
        }
        else {
            return this._redisClient.hgetallAsync(redisKey);
        }
    }
    
    removeFromMap(mapKey, keys) {
        if (mapKey && keys && keys.length > 0) {
            var redisKey = this._getRedisKey(mapKey);
            var multi = this._redisClient.multi();
            keys.forEach((key) => {
                multi.hdel(redisKey, key);
            });
            return multi.execAsync();
        }
        else {
            throw Error("Invalid Input");
        }
    }
    
    searchMap(mapKey, pattern) {
        var redisKey = this._getRedisKey(mapKey);
        if (mapKey && pattern) {
            return new Promise((resolve, reject) => {
                this._scan("HSCAN",  redisKey, ["MATCH", pattern]).then((results) => {
                    if (results) {
                        var final = {};
                        for (let i = 0; i < results.length; i += 2) {
                            var key = results[i];
                            var val = results[i + 1];
                            final[key] = val;
                        }
                        resolve(final);
                    }
                    else {
                        resolve(null);
                    }
                }).catch((err) => {
                    logger.error("[CacheManager]:(searchMap): Error:" + err);
                    reject(err);
                });
                
            });
        }
        else {
            throw Error("Invalid Input");
        }
    }
    
    testPromise (val){
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                if (val) {
                    resolve(true);
                }
                else {
                    reject("Error");
                }
            },100);
        });
    }
}

export default new CacheManager();


/*
// Add multiple
addMultiple (keys , values) {
return new Promise((resolve, reject) => {
if (keys && values && keys.length === values.length) {
var newKeys = keys.map((k) => {
return this._getRedisKey(k);
});
var newValues = values.map((val) => {
return JSON.stringify({value : val});
});

var multi = this._redisClient.multi();
mu
}
else {
logger.error("[CacheManager]:(addMultiple): Error:Input");
reject(new Error("Invalid input"));
}
});
}
*/
