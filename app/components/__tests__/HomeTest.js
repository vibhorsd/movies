jest.dontMock("../Home");
jest.dontMock("material-ui");
jest.dontMock("../../constants");

 import React from "react";
 import TestUtils from "react-addons-test-utils";
 var ReactDOM = require('react-dom');

 const Home = require("../Home");

 describe("home", () => {
     var movieStr1 = "{\"value\":{\"adult\":false,\"backdrop_path\":\"/mQwpjcFzQpZOZWqyyNKsdhjDCxF.jpg\",\"genre_ids\":[18,10402],\"id\":277216,\"original_language\":\"en\",\"original_title\":\"Straight Outta Compton\",\"overview\":\"In 1987, five young men, using brutally honest rhymes and hardcore beats, put their frustration and anger about life in the most dangerous place in America into the most powerful weapon they had: their music. Taking us back to where it all began, Straight Outta Compton tells the true story of how these cultural rebels-armed only with their lyrics, swagger, bravado and raw talent-stood up to the authorities that meant to keep them down and formed the world's most dangerous group, N.W.A. And as they spoke the truth that no one had before and exposed life in the hood, their voice ignited a social revolution that is still reverberating today. Straight Outta Compton stars O\xe2\x80\x99Shea Jackson Jr., Corey Hawkins and Jason Mitchell as Ice Cube, Dr. Dre and Eazy-E, and is directed by F. Gary Gray.\",\"release_date\":\"2015-08-14\",\"poster_path\":\"/X7S1RtotXOZNV7OlgCfh5VKZSB.jpg\",\"popularity\":3.485325,\"title\":\"Straight Outta Compton\",\"video\":false,\"vote_average\":8,\"vote_count\":322}}";

     var movieStr2 = "{\"value\":{\"adult\":false,\"backdrop_path\":\"/rIZ5Qd8wHWhz7unRI1YUgpkTjpJ.jpg\",\"genre_ids\":[27],\"id\":311539,\"original_language\":\"en\",\"original_title\":\"A Christmas Horror Story\",\"overview\":\"Christmas is supposed to be a time of joy, peace and goodwill. But for some folks in the small town of Bailey Downs, it turns into something much less festive.\",\"release_date\":\"2015-10-02\",\"poster_path\":\"/9JOfHZNtv3oOQK6K5BUkhWQIxxO.jpg\",\"popularity\":1.993173,\"title\":\"A Christmas Horror Story\",\"video\":false,\"vote_average\":5.6,\"vote_count\":13}}";

     var movie1 = JSON.parse(movieStr1);
     var movie2 = JSON.parse(movieStr2);
     var allMovies = [movie1,movie2];

    var home = TestUtils.renderIntoDocument(<Home allMovies={allMovies}/> );
     it("renders", () => {
        var homeNode = ReactDOM.findDOMNode(home);
         expect(homeNode).toBeDefined();
     });
});
// jest.dontMock("../Home");
//
// import React from "react";
// import TestUtils from "react-addons-test-utils";
//
// const Home = require("../Home");
//
// describe("home", () => {
//     var home = TestUtils.renderIntoDocument( <Home/> );
//     it("renders", () => {
//         var header = TestUtils.findRenderedDOMComponentWithClass(home,
//             "page-header");
//             expect(header).toBeDefined();
//         });
//         it("should have header with content HomePage", () => {
//             var header = TestUtils.findRenderedDOMComponentWithTag(home, "h1");
//             expect(header).toBeDefined();
//             expect(header.textContent).toEqual("HomePage");
//         });
//         it("should contain paragraph with content Hello, World!", () => {
//             var para = TestUtils.findRenderedDOMComponentWithTag(home, "p");
//             expect(para).toBeDefined();
//             expect(para.textContent).toEqual("Hello, World!");
//         });
//     });
//
