import request from "request"
import {expect} from "chai";
import assert from "assert";

const host = "127.0.0.1";
const port = "3000";
const base_url = "http://127.0.0.1:3000";

const fetchPage = (page, method) => {
    return Promise((resole, reject) => {
        var setting = {
            url : base_url + "/fetch?page_num=" + page_num,
            method: method,
            timeout: 110000,
        };

        request(setting, function(err, resp, body){
            if (err) {
                reject(err);
            }
            else {
                resole(body);
            }
        });
    });
};


describe("Server Rest API test", function(done){
    it("should fetch", function(done){
        this.timeout(10000);
        var setting = {
            url : base_url + "/fetch?page_num=1",
            method: "GET",
            timeout: 110000,
        };

        request(setting, function(err, resp, body){
            if (err) {
                throw err;
            }
            else {
                expect(resp.statusCode).to.equal(200);
                console.dir(body);
                done();
            }
        });

    });
});
