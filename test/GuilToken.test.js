require("chai").use(require("chai-as-promised")).should();

contract("Token", () => {
  describe("deployment", () => {
    it("runs", () => {
      const result = true;
      result.should.equal(true);
    });
  });
});
