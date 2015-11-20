jest.dontMock("../DetailedTile");
jest.dontMock("material-ui");
jest.dontMock("../../constants");

import React from "react";
import TestUtils from "react-addons-test-utils";
var ReactDOM = require('react-dom');

const DetailedTile = require("../DetailedTile");

describe("Home", () =>{
    var movieStr = "{\"value\":{\"adult\":false,\"backdrop_path\":\"/mQwpjcFzQpZOZWqyyNKsdhjDCxF.jpg\",\"genre_ids\":[18,10402],\"id\":277216,\"original_language\":\"en\",\"original_title\":\"Straight Outta Compton\",\"overview\":\"In 1987, five young men, using brutally honest rhymes and hardcore beats, put their frustration and anger about life in the most dangerous place in America into the most powerful weapon they had: their music. Taking us back to where it all began, Straight Outta Compton tells the true story of how these cultural rebels-armed only with their lyrics, swagger, bravado and raw talent-stood up to the authorities that meant to keep them down and formed the world's most dangerous group, N.W.A. And as they spoke the truth that no one had before and exposed life in the hood, their voice ignited a social revolution that is still reverberating today. Straight Outta Compton stars O\xe2\x80\x99Shea Jackson Jr., Corey Hawkins and Jason Mitchell as Ice Cube, Dr. Dre and Eazy-E, and is directed by F. Gary Gray.\",\"release_date\":\"2015-08-14\",\"poster_path\":\"/X7S1RtotXOZNV7OlgCfh5VKZSB.jpg\",\"popularity\":3.485325,\"title\":\"Straight Outta Compton\",\"video\":false,\"vote_average\":8,\"vote_count\":322}}";

     var movie = JSON.parse(movieStr);
     var detailedTile = TestUtils.renderIntoDocument( <DetailedTile movie={movie} details={true}/> );

    it("renders", () => {
        var tileNode = ReactDOM.findDOMNode(detailedTile);
        expect(tileNode).toBeDefined();
    });

    // This is just to check if there are img tag rendered. As there are multiple img tags.
    it("contains image", () =>{
        var imgTag = TestUtils.scryRenderedDOMComponentsWithTag (detailedTile, "img");
        expect(imgTag).toBeDefined();
    });

    // This is just to check if there are div's rendered. As there are multiple div tags.
    it("contains div", () =>{
        var divTag = TestUtils.scryRenderedDOMComponentsWithTag (detailedTile, "div");
        expect(divTag).toBeDefined();
    });
});
