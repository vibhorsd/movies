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

    it("should add and expire", function(done){
        this.timeout(15000);
        var promise = serverCacheManager.addKey("key1","val", 5);

        if (promise){
            promise.then(function(){
               setTimeout(function(){
                   serverCacheManager.getValue("key1").then(function(value){
                       assert.equal(value, null);
                       done();
                   }, function(err){
                       console.log("Error while getting:" + err);
                       done();
                   });
               }, 5100);
            },function(err){
                console.log("Error while adding:" + err);
                assert.equal(null, err);
                done();
            });
        }

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

    it("should remove", function(done){
        this.timeout(10000);
        var cbsucess;
        //cbsucess = jest.genMockFunction();
        //serverCacheManager.addKey("key1","val");
        serverCacheManager.removeKey("key").then(function(){
            done();
        }, function(err){
            assert.equal(null, err);
            console.log("Error while removing:" + err);
            //done();
        });

        //expect(cbsucess).toBeCalled();
    });

    it("should search", function(done){
        serverCacheManager.searchKey("*").then(function(result){
            //console.dir(result);
            done();
        }).fail(function(){
            console.log("Error while searching:" + err);
            assert.equal(null, err);
            //done();
        });
    });

    it("should clean old keys", function(done){
        this.timeout(10000);
        serverCacheManager.cleanCache().then(function(){done()});
    });

    it("should get keys", function(done){
        this.timeout(15000);
        serverCacheManager.addKey("1", "x");
        serverCacheManager.addKey("2", "y");
        setTimeout(function(){
            serverCacheManager.getKeys(["1","2"]).then(function(values){
                assert.notEqual(values, null);
                assert.equal(values.length,2);
                assert.equal(values[0],"x");
                assert.equal(values[1],"y");
                done();
            }).fail(function(err){
                console.log("Error while getting keys:" + err);
                assert.equal(null, err);
                done();
            });
        },2000);

    });

    it("should search #_#", function(done){
        this.timeout(10000);
        serverCacheManager.addKey("#_#1#_#abc","x");
        setTimeout(function(){
            serverCacheManager.searchMovie("abc").then(function(results){
                console.dir(results);
                assert.notEqual(results, null);
                assert.notEqual(results.length, 0);
                var flag =false;
                for (var idx in results) {
                    if (results[idx].title === "abc" && results[idx].id == "1") {
                        flag = true;
                    }
                }
                assert.equal(flag, true);
                serverCacheManager.removeKey("1#_#abc");
                done();
            });
        },1000)

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