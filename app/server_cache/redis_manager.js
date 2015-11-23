/**
* Created by pushanmitra on 09/11/15.
*/

import keyMirror from "keymirror"
import async from "async"
import Q from  "q"
import redis from "redis"
import ServerCacheInterface from "./server_cache_interface"
import AppConst from "../constants"

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
        this._keyPrefix = "MOV";
        this.typeName = "RedisManager";
    }
    _getRedisKey (key) {
        return this._keyPrefix + ":" +key;
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
}

export default new RedisManager();
