import {expect} from "chai";
import assert from "assert";
import ServerState from "../../store/ServerState";

var state = new ServerState();

describe("Server State Test", function(){
    before(function(){
        state.connect();
    });
    
    it("should fetch from IMBD", function(done){
        this.timeout(10000);
        state.fetchMoviesFromIMDB(1).then((value) => {
            console.dir(value);
            expect(value).to.not.equal(null);
            done();
        }).catch((err) => {
            expect(err).to.equal(null);
            done();
        });
    });
});
