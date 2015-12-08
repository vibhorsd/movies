import {expect} from "chai";
import assert from "assert";
import ServerState from "../../store/ServerState";

var state = new ServerState();

describe("Server State Test", function(){
    before(function(){
        state.connect().then((value) => {
            console.log("Sate connected with Cache");
        });
    });
    
    it("should fetch from IMBD", function(done){
        this.timeout(10000);
        state.fetchMoviesFromIMDB(1, true).then((value) => {
            //console.dir(value);
            expect(value).to.not.equal(null);
            done();
        }).catch((err) => {
            expect(err).to.equal(null);
            done();
        });
    });
    
    it("should not fetch from IMBD", function(done){
        this.timeout(10000);
        state.fetchMoviesFromIMDB(25, true).then((value) => {
            console.dir(value[0]);
            expect(value).to.not.equal(null);
            done();
        }).catch((err) => {
            expect(err).to.equal(null);
            done();
        });
    });
    
    it("should fetch page", function(done){
        this.timeout(25000);
        state.page(2).then((value) => {
            //console.dir(value);
            console.log("Page : [1]: Cahced:" + value.cached);
            expect(value).to.not.equal(null);
            expect(value.page).to.not.equal(null);
            done();
        }).catch((err) => {
            expect(err).to.equal(null);
            done();
        });
    });
    
    it("should fetch movie", function(done){
        this.timeout(25000);
        state.page(2).then((pageResult) => {
            expect(pageResult).to.not.equal(null);
            expect(pageResult.page).to.not.equal(null);
            var movieId = pageResult.page.results[0].id;
            console.log(" Fething movie:" + movieId);
            state.movie(movieId).then((movie)=> {
                expect(movie).to.not.equal(null);
                expect(movie.id).to.equal(movieId);
                done();
            });
            
        }).catch((err) => {
            expect(err).to.equal(null);
            done();
        });
    });
    
    it("should change movie json", function(done){
        this.timeout(25000);
        state.page(2).then((pageResult) => {
            expect(pageResult).to.not.equal(null);
            expect(pageResult.page).to.not.equal(null);
            var movieId = pageResult.page.results[0].id;
            var random = Math.floor(Math.random() * 10000);
            //console.log(" Fething movie:" + movieId);
            state.updateMovie(movieId, {newKey : random}).then((update) => {
                expect(update.newKey).to.equal(random);
                console.log(" Fetching...");
                state.movie(movieId).then((movie)=> {
                    expect(movie).to.not.equal(null);
                    expect(movie.id).to.equal(movieId);
                    expect(movie.newKey).to.equal(random);
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
    
    it("should search movies", function(){
        this.timeout(25000);
        state.page(2).then((pageResult) => {
            expect(pageResult).to.not.equal(null);
            expect(pageResult.page).to.not.equal(null);
            var movieTitle = pageResult.page.results[0].title;
            var id = pageResult.page.results[0].id;
            console.log(" Searching movie title:" + movieTitle);
            state.search(movieTitle).then((results) => {
                for (var key in result) {
                    if (key === id) {
                        expect(result[key].title).to.equal(movieTitle);
                        done();
                        break;
                    }
                }
            }).catch((err) => {
                expect(err).to.equal(null);
                done();
            });
            
            
        }).catch((err) => {
            expect(err).to.equal(null);
            done();
        });
    });
    
    
});
