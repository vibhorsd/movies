import {expect} from "chai";
import assert from "assert";
import {store, storeDispatcher} from "../../store";
import AppConst from "../../constants"
import {connect, fetch} from "../../store/server_actions"

const ACTION = AppConst.ACTIONS;
describe("Server store Test", function(){
    before(function(){
        var action = connect();
        store.dispatch(action);
        store.getState().promises[action.id].then((value) => {
            console.log("Store Connected");
        })
    });
    
    it("should wait", function(done){
        this.timeout(10000);
        setTimeout(function(){
            done();
        }, 4000);
    });
    
    it("should fetch", function(done){
        this.timeout(10000);
        storeDispatcher(fetch(5)).then((value) => {
            expect(value).to.not.equal(null);
            expect(value.page).to.not.equal(null);
            done();
        }).catch((err) => {
            expect(err).to.equal(null);
            done();
        });
        
        
    });
});
