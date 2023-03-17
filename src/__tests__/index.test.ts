import AuthController from '@controller/auth.controller';

describe("auth-controller", () => {
  test("is defined", () => {
    const sut = new AuthController();
    expect(sut).toBeDefined();
  });
});