import Config from "@/global/config";

const baseURL = "https://test.io";
const endpoints = { test: "/test" };

describe("Options", () => {
  it("should create a new instance with given options", () => {
    const ins = Config.instance({ baseURL, endpoints });
    expect(ins).toBeDefined();
    expect(ins.baseURL).toEqual(baseURL);
  });

  it("should maintain the same singleton instance", () => {
    const instance1 = Config.instance();
    const instance2 = Config.instance({ baseURL, endpoints });

    expect(instance1).toBe(instance2);
    expect(instance1.baseURL).toEqual(baseURL);
  });

  it("should have a default headers property as an instance of Headers", () => {
    const instance = Config.instance();
    expect(instance.headers).toBeInstanceOf(Headers);
  });
});
