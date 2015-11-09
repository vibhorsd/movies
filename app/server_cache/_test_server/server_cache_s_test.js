/**
 * Created by pushanmitra on 06/11/15.
 */
var assert = require("assert");

describe("ServerCache Test",()=>{
    var serverCacheManager = require("../../server_cache");
    it("should add", (done) => {
        //console.dir(serverCacheManager);
        var promise = serverCacheManager.addKey("key",{str:"hello world"});

        if (promise){
            promise.then(function(){
                done();
            },function(err){
                console.log("Error while adding:" + err);
            });
        }
        /*serverCacheManager.addKey("key",{str:"hello world"}).then(cbsucess,function(err){
         console.log("Error while adding:" + err);
         });*/
        //expect(cbsucess).toBeCalled();
    });

    it("should update", (done) => {
        serverCacheManager.updateKey("key",{str:"hello world:1"}).then(function(){
            done();
        },function(err){
            console.log("Error while adding:" + err);
        });

    });

    it("should get", (done) => {
        serverCacheManager.addKey("keyAdd", "x");
        serverCacheManager.getKey("keyAdd", function(err, val){
            assert.equal(null, err);
            assert.equal(val,"x");
            done();
        });

    });

    it("should remove", (done) => {
        var cbsucess;
        //cbsucess = jest.genMockFunction();
        serverCacheManager.addKey("key1","val");
        serverCacheManager.removeKey("key1").then(function(){
            done();
        }, function(err){
            console.log("Error while removing:" + err);
        });

        //expect(cbsucess).toBeCalled();
    });
});