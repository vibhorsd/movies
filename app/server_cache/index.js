/**
 * Created by pushanmitra on 05/11/15.
 */
import EventEmitter  from "events"
import keyMirror from "keymirror"
import async from "async"
import Q from  "q"
import redisManager from "./redis_manager"
import app_utl from "../app_utl"
import AppConst from "../constants"

class ServerCacheManager extends app_utl.BaseController  {
    /*!
     @constructor
     * */
    constructor(){
        super();
        this._typeName = "ServerCacheManager";
        this.OPERATION_EVENTS = keyMirror({
            STORE_OBJECT_CREATED: null,
            STORE_OBJECT_UPDATE : null,
            STORE_OBJECT_REMOVED: null,
            STORE_OBJECT_OPERATION_ERROR: null
        });
        this.EVENTS = keyMirror({
            STORE_READY : null,
            STORE_CONNECTED: null,
            STORE_DISCONNECTED: null,
            STORE_CONNECTION_ERROR: null
        });

        this.STATE = keyMirror({
            ready : null,
            disconnected: null
        });

        this.state = this.STATE.disconnected;
        this._localDataStorage = {}
    }

    /*!
     connect to the caching system
     */
    connect(){
        var deferred = Q.defer();
        return redisManager.connect(6379,"redis"); // In case for localhost use redisManager.connect(6379,"127.0.0.1")
    }

    addKey(key , object, expiry){
        return redisManager.addKey(key, object, expiry);
    }

    updateKey(key , updateObj){
        var deferred = Q.defer();
        this._localDataStorage[key] = updateObj;
        setTimeout(function(){
            async.series([
                function(){
                    deferred.resolve(key);
                },
                function(){
                    this.emit(this.OPERATION_EVENTS.STORE_OBJECT_UPDATE, {
                        key : key,
                        value: object
                    });
                }
            ]);
        },0.1);
        return deferred.promise;
    }

    removeKey(key){
        return redisManager.removeKey(key);
    }

    getValue (key){
        var obj = redisManager.getValue(key);
        return obj;
    }

    addMovie(movie, expiry) {
        if (movie.id && movie.title) {
            this.addKey(movie.id, movie, expiry);
            var splKey = "#_#" + movie.id + "#_#" + movie.title.toLowerCase();
            this.addKey(splKey, movie.id, expiry);
        }
        else  {
            this.error_log("[addMovie]: Invalid movie obj");
            return;
        }
    }
    searchKey(key) {
        return redisManager.searchKey(key);
    }
    searchMovie(title) {
        var deffer = Q.defer();
        if (title) {
            var key = "*#_#*#_#*" + title + "*";
            var promise = redisManager.searchKey(key);
            promise.
            then(function(result){
                var finalResult = [];
                var ids = [];
                for (var idx in result) {
                    var key = result[idx];
                    var compos =key.split('#_#');
                    var title = compos.pop();
                    var id = compos.pop();
                    finalResult.push({title: title, id: id});
                }
                deffer.resolve(finalResult);
            }.bind(this))
                .fail(function(){
                    this.error_log('Search fails with error');
                    deffer.resolve([]);
                }.bind(this)) ;
        }
        else {
            async.async.series([
                function(){
                    deffer.reject(AppConst.ServerCacheError.INVALID_INPUT);
                }
            ]);
        }
        return deffer.promise;
    }

    cleanCache(cleanAll){
        return redisManager.cleanRedis(cleanAll);
    }

    getKeys(keys) {
        return redisManager.getKeys(keys);
    }

}

export default new ServerCacheManager();
