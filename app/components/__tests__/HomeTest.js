jest.dontMock("../Home");

import React from "react";
import TestUtils from "react-addons-test-utils";

const Home = require("../Home");

describe("home", () => {
    var home = TestUtils.renderIntoDocument( <Home/> );
    it("renders", () => {
        var header = TestUtils.findRenderedDOMComponentWithClass(home,
            "page-header");
            expect(header).toBeDefined();
        });
        it("should have header with content HomePage", () => {
            var header = TestUtils.findRenderedDOMComponentWithTag(home, "h1");
            expect(header).toBeDefined();
            expect(header.textContent).toEqual("HomePage");
        });
        it("should contain paragraph with content Hello, World!", () => {
            var para = TestUtils.findRenderedDOMComponentWithTag(home, "p");
            expect(para).toBeDefined();
            expect(para.textContent).toEqual("Hello, World!");
        });
    });
    