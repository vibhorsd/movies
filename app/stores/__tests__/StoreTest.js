jest.dontMock("../index")

import { MovieStore } from "../../stores"

describe("StoreTest", () => {
    it("should import", () => {
        expect(MovieStore).toBeDefined();
    });
});