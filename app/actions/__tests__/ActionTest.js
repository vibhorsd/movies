jest.dontMock("../index")

import { FetchMovieAction } from "../../actions"

describe("ActionTest", () => {
    it("should iport", () => {
        expect(FetchMovieAction).toBeDefined();
    });
});