jest.dontMock("keymirror");
jest.dontMock("../../constants");


import AppConst from "../../constants"
console.dir(AppConst);

describe("ConstTest", () => {
    it("should import", () => {
        expect(AppConst).toBeDefined();
    });

    it("should import", () => {
        expect(AppConst.ActionTypes).toBeDefined();
    });
});