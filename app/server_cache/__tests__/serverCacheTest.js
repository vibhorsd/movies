/**
 * Created by pushanmitra on 06/11/15.
 */
//jest.dontMock("../index");
jest.autoMockOff();
var x = require("keymirror");
var q = require("q");
import serverCacheManager from "../../server_cache"
describe("ServerCache Test",()=>{
    it("should add", () => {

        var cbsucess = function(){};
        serverCacheManager.addKey("key",{str:"hello world"}).then(cbsucess,function(err){
            console.log("Error while adding:" + err);
        });
        expect(cbsucess).toBeCalled();
    });

    it("should update", () => {
        var cbsucess = function(){};
        serverCacheManager.updateKey("key",{str:"hello world:1"}).then(cbsucess,function(err){
            console.log("Error while adding:" + err);
        });
        expect(cbsucess).toBeCalled();
    });

    it("should get", () => {
        var cb = function(err, val){
            expect(val).toEqual("x");
        };
        serverCacheManager.addKey("keyAdd", "x");
        serverCacheManager.getKey("keyAdd", cb);

        expect(cb).toBeCalled();
    });

    it("should remove", () => {
        var cbsucess = function(){};
        serverCacheManager.addKey("key1","val");
        serverCacheManager.removeKey("key1").then(cbsucess, function(err){
            console.log("Error while removing:" + err);
        });
    });
});