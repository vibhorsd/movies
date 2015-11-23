jest.dontMock("../AppDispatcher")

import dispatcher from "../../dispatcher/AppDispatcher"

describe("DispatcherTest", () => {
    it("should import", () => {
        expect(dispatcher).toBeDefined();
    });
});