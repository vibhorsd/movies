import {expect} from "chai";
import cacheManager from "../../cache_manager";
import setting from "../setting";
import assert from "assert";

describe("Cache Test", () => {
    before(function() {
        cacheManager.connect().then(() => {
            cacheManager.getRedisAppInfo().then((value) => {
                expect(setting.info.version).to.equal(value.version);
            }).catch((err) => {
                expect(err).to.equal(null);
            });
        }).catch((err) => {
            expect(err).to.equal(null);
        });
    });
    
    it("should Promise Sucess", function(done){
        cacheManager.testPromise("hi").then((val) => {
            expect(val).to.equal(true);
            done();
        })
    });
    
    it("should Promise Failure", function(){
        cacheManager.testPromise().catch((err) => {
            expect(err).to.equal("Error");
            done();
        })
    });
    
    it ("should Multiple promise", function (done){
        var promise = cacheManager.testPromise("hi");
        promise.then(() => {
            console.log("Case 1");
        });
        promise.then(() => {
            console.log("Case 2");
        });
        
        setTimeout(()=> {
            done();
        }, 1000);
    });
    
    it("should add/get", function(done){
        this.timeout(10000);
        cacheManager.add("x", {x: "x"},100).then(() => {
            cacheManager.get("x").then((value) => {
                expect(value.x).to.equal("x");
                done();
            }).catch((err) => {
                expect(err).to.equal(null);
                done();
            });
        }).catch((err) => {
            expect(err).to.equal(null);
            done();
        });
    });
    
    it("should add and expire", function(done){
        this.timeout(15000);
        cacheManager.add("x", "value", 5).then((value) => {
            setTimeout(()=>{
                cacheManager.get("y").then((value) => {
                    expect(value).to.equal(null);
                    done();
                }).catch((err) => {
                    expect(err).to.equal(null);
                    done();
                });
            }, 5000);
        }).catch((err) => {
            expect(err).to.equal(null);
            done();
        });
    });
    
    it("should add and remove", function (done){
        this.timeout(10000);
        cacheManager.add("x", "value", 10).then((value) => {
            cacheManager.remove(["y"]).then((value) => {
                cacheManager.get("y").then((value) => {
                    expect(value).to.equal(null);
                    done();
                }).catch((err) => {
                    expect(err).to.equal(null);
                    done();
                });
            }).catch((err) => {
                expect(err).to.equal(null);
                done();
            });
        }).catch((err) => {
            expect(err).to.equal(null);
            done();
        });
    });
    
    it ("should search pattern", function(done){
        this.timeout(20000);
        var exp = 20;
        cacheManager.add("x_@he1llo2@_x1", "xx", exp);
        cacheManager.add("y_@he1llo2@_y1", "yy", exp);
        cacheManager.add("z_@he1llo2@_z1", "zz", exp);
        setTimeout(()=>{
            cacheManager.search("*@he1llo2@*").then((results) => {
                //console.dir(results);
                expect(results).to.have.length(3);
                done();
            }).catch((err) => {
                expect(err).to.equal(null);
                done();
            });
        }, 100);
    });
    
    it ("should add / get map", function (done){
        this.timeout(10000);
        var objInput = {x: "x", y:"y"};
        cacheManager.addMap("map1", objInput, 10).then(() => {
            cacheManager.getMap("map1").then((object) => {
                for (var key in objInput) {
                    if (objInput.hasOwnProperty(key)) {
                        var val = objInput[key];
                        expect(val).to.equal(object[key]);
                    }
                }
                
                cacheManager.getMap("map1", ["x"]).then((object) => {
                    //console.dir(object);
                    //expect(Object.keys(object)).to.equal(1);
                    expect(object.x).to.equal(objInput.x);
                    done();
                }).catch((err) => {
                    expect(err).to.equal(null);
                    done();
                });
            }).catch((err) => {
                expect(err).to.equal(null);
                done();
            });
        }).catch((err) => {
            expect(err).to.equal(null);
            done();
        });
    });
    
    it ("should not add", function(done){
        try {
            cacheManager.addMap("map2", {x : 1}, 10);
        } catch (e) {
            assert.notEqual(null, e);
            done();
            //assert.ifError(e);
        }
    });
    
    it("should remove keys", function(done){
        this.timeout(10000);
        cacheManager.addMap("map3", {x: "xx", y: "yy"}, 10).then(() => {
            cacheManager.removeFromMap("map3", ["x"]).then(() => {
                cacheManager.getMap("map3", ["x"]).then((value) => {
                    expect(value.x).to.equal(null);
                    done();
                }).catch((err) => {
                    expect(err).to.equal(null);
                    done();
                });
            }).catch((err) => {
                expect(err).to.equal(null);
                done();
            });
        }).catch((err) => {
            expect(err).to.equal(null);
            done();
        });
    });
    
    it("should search map", function(done){
        this.timeout(10000);
        cacheManager.addMap("map4", {"x_hnbnh_x": "xx",
        "y_hnbnh_y" : "yy",
        "z" : "z"}, 100).then(() => {
            cacheManager.searchMap("map4", "*hnbnh*").then((result) => {
                //console.dir(result);
                expect(result).to.not.equal(null);
                expect(result["y_hnbnh_y"]).to.equal("yy");
                expect(result["x_hnbnh_x"]).to.equal("xx");
                done();
            }).catch((err) => {
                expect(err).to.equal(null);
                done();
            });
        }).catch((err) => {
            expect(err).to.equal(null);
            done();
        });
    });
    
    /*it ("should add multiple", function (done) {
    var inputs = ["xx","yy", "zz"];
    cacheManager.addMultiple(["x","y", "z"],inputs).then(() => {
    cacheManager.getMultiple(["x","y","z"]).then((values) => {
    expect(values).to.have.length(3);
    values.forEach((val, index)=>{
    expect(val).to.equal(inputs[index]);
});
done();
}).catch((err) => {
expect(err).to.equal(null);
done();
});
}).catch((err) => {
expect(err).to.equal(null);
done();
});
})*/




/*it("should connect", function(done){
this.timeout(10000);
cacheManager.connect().then(() => {
cacheManager.getRedisAppInfo().then((value) => {
expect(setting.info.version).to.equal(value.version);
done();
}).catch((err) => {
expect(err).to.equal(null);
done();
});
}).catch((err) => {
expect(err).to.equal(null);
done();
});
});*/
});
