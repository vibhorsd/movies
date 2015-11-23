jest.dontMock("../index")

import { FetchMovieAction } from "../../actions"

describe("ActionTest", () => {
    it("should import", () => {
        expect(FetchMovieAction).toBeDefined();
    });
});