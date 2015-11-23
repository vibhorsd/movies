/**
* Created by pushanmitra on 09/11/15.
*/

import keyMirror from "keymirror"
import async from "async"
import Q from  "q"
import redis from "redis"
import ServerCacheInterface from "./server_cache_interface"
import AppConst from "../constants"
import settings from "./server_cache_setting"

class RedisManager extends ServerCacheInterface {
    constructor(){
        super();
        this._redisClient = null;
        this.STATUS = {
            Connected : "connected",
            Connecting : "connecting",
            Disconnected : "disconnected",
            Disconnecting : "disconnecting",
            Error : "error"
        }
        this._status = this.STATUS.Disconnected;
        
        this._maxAliveSec = 24 * 60 * 60;
        this._keyPrefix = settings.versions[settings.current];
        this.typeName = "RedisManager";
    }
    _getRedisKey (key) {
        return this._keyPrefix + ":" + key;
    }

    removeKeysWithPattern(pattern){
        var deferred = Q.defer();
        this._redisClient.keys(pattern, function(err, results){
            if (err === null) {
                if (results && results.length > 0) {
                    this.log("[Remove keys:("+ pattern +"): will remove total keys:" + results.length + "]");
                    this._redisClient.del(results, (error)=> {
                        if (error !== null) {
                            this.error_log("[Remove keys:("+ pattern +"): Error:]:" + error);
                        }
                        else {
                            this.log("[Remove keys:("+ pattern +"): success]")
                        }
                        deferred.resolve();
                    });
                }
                else {
                    deferred.resolve();
                }
            }
            else {
                this.error_log('[Remove keys:(${pattern}) Error:1]:' + err);
                deferred.resolve();
            }
        }.bind(this));
        return deferred.promise;
    }
    cleanRedis(removeAll) {
        var deferred = Q.defer();
        if (removeAll) {
            this._redisClient.keys("*", function(err, results){
                if (err === null) {

                    if (results.length > 0) {
                        this.log("[Remove All: will remove total keys:" + results.length + "]");
                        this._redisClient.del(results, (error)=>{
                            if (error !== null) {
                                this.error_log("[Remove All Error:]:" + error);
                            }
                            else {
                                this.log("[Remove all success]")
                            }
                            deferred.resolve();
                        });
                    }
                    else {
                        deferred.resolve();
                    }

                }
                else {
                    this.error_log("[Remove All Error:1]:" + err);
                    deferred.resolve();
                }
            }.bind(this));
        }
        else {
            var versions = settings.versions;
            var removeKeys = function(keys,cb){
                if (keys.length > 0) {
                    var key = keys.pop();
                    var pattern = key + "*";
                    this.removeKeysWithPattern(pattern).then(function(){
                        removeKeys(keys,cb);
                    });
                }
                else  {
                    this.log("[Remove old keys:DONE]");
                    if (cb){
                        cb();
                    }
                    deferred.resolve();
                }

            }.bind(this);
            var remKeys = [];
            for (var ver in versions) {
                if (ver !== settings.current){
                    remKeys.push(versions[ver]);
                }
            }
            removeKeys(remKeys);
        }
        return deferred.promise;
    }

    connect(port, host){
        var deferred = Q.defer();
        this._status = this.STATUS.Connecting;
        this._redisClient = redis.createClient(port, host);
        var deferred = Q.defer();
        this._redisClient.on("connect", function(){
            this._status = this.STATUS.Connected;
            deferred.resolve();
            
        }.bind(this));
        
        this._redisClient.on("error", function(error){
            
            if (this._status === this.STATUS.Connecting){
                this._status = this.STATUS.Disconnected;
                deferred.reject(error);
                
            }
            else {
                this._status = this.STATUS.Error;
                this.error_log("Redis Error:" + error);
            }
        }.bind(this));
        
        return deferred.promise;
    }
    addKey(key , object, expiry){
        var deferred = Q.defer();
        if (key && object) {
            if (this._status = this.STATUS.Connected){
                var val = JSON.stringify({
                    value : object
                });
                var redisKey  = this._getRedisKey(key);
                
                if (expiry && expiry > 0) {
                    this._redisClient.setex(redisKey, expiry, val, function(err){
                        if (err === null) {
                            deferred.resolve(key);
                        }
                        else {
                            this.error_log("Redis Error:" + err);
                            deferred.reject(AppConst.ServerCacheError.CACHE_SYS_ERROR);
                        }
                    });
                }
                else {
                    this._redisClient.set(redisKey,val, function(err){
                        if (err === null) {
                            deferred.resolve(key);
                        }
                        else {
                            this.error_log("Redis Error:" + err);
                            deferred.reject(AppConst.ServerCacheError.CACHE_SYS_ERROR);
                        }
                    });
                }
            }
            else {
                async.async.series([
                    function(){
                        deferred.reject(AppConst.ServerCacheError.NOT_CONNECTED);
                    }
                ]);
            }
        }
        else {
            async.async.series([
                function(){
                    deferred.reject(AppConst.ServerCacheError.INVALID_INPUT);
                }
            ]);
        }
        return deferred.promise;
    }
    
    removeKey(key) {
        var deferred = Q.defer();
        if (key) {
            if (this._redisClient){
                var redisKey  = this._getRedisKey(key);
                this._redisClient.del(redisKey, function(err){
                    if (err === null) {
                        deferred.resolve(key);
                    }
                    else {
                        this.error_log("Redis Error:" + err);
                        deferred.reject(AppConst.ServerCacheError.CACHE_SYS_ERROR);
                    }
                }.bind(this));
            }
            else {
                async.async.series([
                    function(){
                        deferred.reject(AppConst.ServerCacheError.NOT_CONNECTED);
                    }
                ]);
            }
        }
        else {
            async.async.series([
                function(){
                    deferred.reject(AppConst.ServerCacheError.INVALID_INPUT);
                }
            ]);
        }
        return deferred.promise;
    }
    
    getValue(key){
        var deferred = Q.defer();
        if (key) {
            if (this._redisClient){
                var redisKey  = this._getRedisKey(key);
                this._redisClient.get(redisKey, function(err, valueStr){
                    if (err === null) {
                        if (valueStr) {
                            var valObj = JSON.parse(valueStr);
                            var obj = valObj.value;
                            deferred.resolve(obj);
                        }
                        else {
                            deferred.resolve(null);
                        }
                    }
                    else {
                        this.error_log("Redis Error:" + err);
                        deferred.reject(AppConst.ServerCacheError.CACHE_SYS_ERROR);
                    }
                });
            }
            else {
                async.series([
                    function(){
                        deferred.reject(AppConst.ServerCacheError.NOT_CONNECTED);
                    }
                ]);
            }
        }
        else {
            async.async.series([
                function(){
                    deferred.reject(AppConst.ServerCacheError.INVALID_INPUT);
                }
            ]);
        }
        return deferred.promise;
    }

    searchKey(pattern) {
        var deferred = Q.defer();
        if (pattern && pattern.length > 0) {
            var patternKey = this._keyPrefix + ":" + pattern;
            this._redisClient.keys(patternKey, (err, results)=>{
                if (err !== null) {
                    this.error_log("Redis Error:" + err);
                    deferred.reject(AppConst.ServerCacheError.CACHE_SYS_ERROR);
                }
                else  {
                    deferred.resolve(results);
                }
            });
        }
        else {
            async.async.series([
                function(){
                    deferred.reject(AppConst.ServerCacheError.INVALID_INPUT);
                }
            ]);
        }
        return deferred.promise;
    }

    getKeys(keys){
        var deferred = Q.defer();
        if (keys && keys.length > 0) {
            var multi = this._redisClient.multi();
            keys.forEach((key)=>{
                var keyRedis = this._getRedisKey(key);
                multi.get(keyRedis);
            });

            multi.exec((err, result)=>{
                if (err === null) {
                    var final = [];
                    result.forEach((objStr)=>{
                        var obj = JSON.parse(objStr)
                        final.push(obj.value);
                    });
                    deferred.resolve(final);

                }
                else {
                    this.error_log("Redis Error:" + err);
                    deferred.reject(AppConst.ServerCacheError.CACHE_SYS_ERROR);
                }
            });
        }
        else {
            async.async.series([
                function(){
                    deferred.reject(AppConst.ServerCacheError.INVALID_INPUT);
                }
            ]);
        }
        return deferred.promise;
    }
}

export default new RedisManager();
