/**
 * Created by pushanmitra on 13/11/15.
 */
var assert = require("assert");
import Q from "q"
import async from "async"

describe("Test for Q", () => {
    var testPassQ = function(){
        var differed = Q.defer();
        async.series([
            function(){
                differed.resolve("pass");
            }
        ]);
        return differed.promise;
    };

    var testFailQ = function(){
        var differed = Q.defer();
        async.series([
            function(){
                differed.reject("fail");
            }
        ]);
        return differed.promise;
    };

    function equal1(one){
        var differed = Q.defer();
        async.series([
            function(){
                if (one === 1) {
                    differed.resolve();
                }
                else {
                    differed.reject(one);
                }
            }
        ]);
        return differed.promise;
    }

    it("should pass", function(done){
        testPassQ().then(function(val){
            assert.equal(val, "pass");
            done();
        });
    });

    it("should fail", function(done){
        testFailQ().fail(function(error){
            assert.equal(error,"fail");
            done();
        });
    });

    it ("should fail for two", function(done){
        equal1(2).then(function(){
                assert.equal("", null);
                done();
            })
            .fail(function(error){
                assert.equal(2, error);
                done();
            });
    });

    it ("should pass for one", function(done){
        equal1(1).then(function(){
            //assert.equal("", null);
            done();
        }).
        fail(function(error){
            assert.equal("", null);
            done();
        });
    });
});