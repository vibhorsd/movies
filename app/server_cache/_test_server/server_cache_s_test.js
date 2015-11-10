/**
 * Created by pushanmitra on 06/11/15.
 */
var assert = require("assert");

describe("ServerCache Test",()=>{
    var serverCacheManager = require("../../server_cache");
    before(function() {
        // runs before all tests in this block
        serverCacheManager.connect().then(function(){
           console.log("Server cache mamanger connected")
        }, function(err){
            console.log("Error while connecting:" + err);

        });
    });

    it("should add", (done) => {
        //console.dir(serverCacheManager);
        var promise = serverCacheManager.addKey("key",{str:"hello world"});

        if (promise){
            promise.then(function(){
                done();
            },function(err){
                console.log("Error while adding:" + err);
                assert.equal(null, err);
                done();
            });
        }
        /*serverCacheManager.addKey("key",{str:"hello world"}).then(cbsucess,function(err){
         console.log("Error while adding:" + err);
         });*/
        //expect(cbsucess).toBeCalled();
    });

    /*it("should update", (done) => {
        serverCacheManager.updateKey("key",{str:"hello world:1"}).then(function(){
            done();
        },function(err){
            console.log("Error while adding:" + err);
        });

    });*/

    it("should get", function(done) {
        this.timeout(10000);
        serverCacheManager.addKey("keyAdd", "x").then(function(){
            serverCacheManager.getValue("keyAdd").then(function(value){
                assert.equal(value,"x");
                done();
            }, function(err){
                console.log("Get Error :" + err);
                assert.equal(null, err);
                done();
            });

        }, function(err){
            assert.equal(null, err);
            done();
        });

    });

    it("should remove", (done) => {
        setTimeout(done, 10000);
        var cbsucess;
        //cbsucess = jest.genMockFunction();
        //serverCacheManager.addKey("key1","val");
        serverCacheManager.removeKey("key").then(function(){
            done();
        }, function(err){
            assert.equal(null, err);
            console.log("Error while removing:" + err);
            done();
        });

        //expect(cbsucess).toBeCalled();
    });

    /*it("should connect", (done) => {
        serverCacheManager.connect().then(function(){
            assert.equal(null,null);
            done();
        }, function(err){
            console.log("Error while removing:" + err);
            assert.equal(null,"");
            done();
        });
    });*/
});