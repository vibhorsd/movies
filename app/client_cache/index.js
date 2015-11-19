/**
* Created by pushanmitra on 09/11/15.
*/
import EventEmitter  from "events"
import Q from  "q"
import AppConst from "../constants"


class ClientCacheManger  extends EventEmitter{
    constructor(){
        super();
        this.db = null;
        this.STATUS = {
            Connected : "connected",
            Disconnected : "disconnected",
            Error : "error"
        }
        this._status = this.STATUS.Disconnected;
    }
    
    connect(){
        var deferred = Q.defer();
        console.log("Connecting to Indexed DB...")
        var DBOpenRequest = window.indexedDB.open("MovieList");
        
        DBOpenRequest.onsuccess = function(event) {
            // store the result of opening the database in the db variable.
            this.db = DBOpenRequest.result;
            this._status = this.STATUS.Connected;
            console.log("Connected to Indexed DB")
            deferred.resolve();
        }.bind(this);
        
        // This event handles the event whereby a new version of the database needs to be created
        // Either one has not been created before, or a new version number has been submitted via the
        // window.indexedDB.open line above
        DBOpenRequest.onupgradeneeded = function(event) {
            var db = event.target.result;
            db.onerror = function(event) {
                console.log("Error loading database");
                deferred.reject(AppConst.ClientCacheError.DB_LOAD_ERROR);
            }.bind(this);
            
            // Create an objectStore for this database
            var objectStore = db.createObjectStore("MovieList", { keyPath: "id" });
            objectStore.createIndex("object", "object", { unique: false });
            console.log('Object store created.');
        }.bind(this);
        
        return deferred.promise;
    }
    
    add(object){
        var deferred = Q.defer();
        if(this._status == this.STATUS.Connected){
            var transaction = this.db.transaction(["MovieList"], "readwrite");
            // report on the success of opening the transaction
            transaction.onsuccess = function(event) {
                console.log("Transaction opened for task addition.");
                // create an object store on the transaction
                var objectStore = transaction.objectStore("MovieList");
                // add our newItem object to the object store
                var objectStoreRequest = objectStore.add(object);
                objectStoreRequest.onsuccess = function(event) {
                    // report the success of our get operation
                    console.log('Record added.');
                    deferred.resolve(object);
                }.bind(this);
            };
            transaction.onerror = function(event) {
                console.log("Transaction not opened due to error. Duplicate items not allowed.");
                deferred.reject(AppConst.ClientCacheError.TRANSACTION_FAILED);
            };
        }else{
            deferred.reject(AppConst.ClientCacheError.NOT_CONNECTED);
        }
        return deferred.promise;
    }
    
    remove(key) {
        var deferred = Q.defer();
        if(this._status == this.STATUS.Connected){
            var transaction = this.db.transaction(["MovieList"], "readwrite");
            // report on the success of opening the transaction
            transaction.onsuccess = function(event) {
                console.log("Transaction opened for task deletion.");
                // create an object store on the transaction
                var objectStore = transaction.objectStore("MovieList");
                // add our newItem object to the object store
                var objectStoreRequest = objectStore.delete(key);
                deferred.resolve(key);
            };
            transaction.onerror = function(event) {
                console.log("Transaction not opened due to error.");
                deferred.reject(AppConst.ClientCacheError.TRANSACTION_FAILED);
            };
        }else{
            deferred.reject(AppConst.ClientCacheError.NOT_CONNECTED);
        }
        return deferred.promise;
    }
    
    getValue(key){
        
        var deferred = Q.defer();
        if(this._status == this.STATUS.Connected){
            var transaction = this.db.transaction(["MovieList"], "readwrite");
            // report on the success of opening the transaction
            transaction.oncomplete = function(event) {
                console.log('Transaction completed.');
            };
            transaction.onerror = function(event) {
                console.log('Transaction not opened due to error: ' + transaction.error);
                deferred.reject(AppConst.ClientCacheError.TRANSACTION_FAILED);
            };
            // create an object store on the transaction
            var objectStore = transaction.objectStore("MovieList");
            // clear all the data out of the object store
            var objectStoreRequest = objectStore.get(key);
            objectStoreRequest.onsuccess = function(event) {
                // report the success of our get operation
                console.log('Record retrieved.');
                var obj = objectStoreRequest.result;
                deferred.resolve(obj);
            }.bind(this);
        }else{
            deferred.reject(AppConst.ClientCacheError.NOT_CONNECTED);
        }
        return deferred.promise;
    }
}
export default new ClientCacheManger();
