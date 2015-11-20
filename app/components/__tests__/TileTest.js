 jest.dontMock("../Tile");
 jest.dontMock("material-ui");
 jest.dontMock("../../constants");

 import React from "react";
 import TestUtils from "react-addons-test-utils";
 var ReactDOM = require('react-dom');

 const Tile = require("../Tile");

 describe("Home", () => {

     var movieStr = "{\"value\":{\"adult\":false,\"backdrop_path\":\"/mQwpjcFzQpZOZWqyyNKsdhjDCxF.jpg\",\"genre_ids\":[18,10402],\"id\":277216,\"original_language\":\"en\",\"original_title\":\"Straight Outta Compton\",\"overview\":\"In 1987, five young men, using brutally honest rhymes and hardcore beats, put their frustration and anger about life in the most dangerous place in America into the most powerful weapon they had: their music. Taking us back to where it all began, Straight Outta Compton tells the true story of how these cultural rebels-armed only with their lyrics, swagger, bravado and raw talent-stood up to the authorities that meant to keep them down and formed the world's most dangerous group, N.W.A. And as they spoke the truth that no one had before and exposed life in the hood, their voice ignited a social revolution that is still reverberating today. Straight Outta Compton stars O\xe2\x80\x99Shea Jackson Jr., Corey Hawkins and Jason Mitchell as Ice Cube, Dr. Dre and Eazy-E, and is directed by F. Gary Gray.\",\"release_date\":\"2015-08-14\",\"poster_path\":\"/X7S1RtotXOZNV7OlgCfh5VKZSB.jpg\",\"popularity\":3.485325,\"title\":\"Straight Outta Compton\",\"video\":false,\"vote_average\":8,\"vote_count\":322}}";

//     var movie = {poster_path: "/1n9D32o30XOHMdMWuIT4AaA5ruI.jpg", onClick: null};
     var movie = JSON.parse(movieStr);
     var tile = TestUtils.renderIntoDocument( <Tile movie={movie}/> );
     it("renders", () => {
         var tileNode = ReactDOM.findDOMNode(tile);
         expect(tileNode).toBeDefined();
     });
     it("contains img", () => {
         var img = TestUtils.findRenderedDOMComponentWithTag(tile, "img");
         expect(img).toBeDefined();
     });
 });
