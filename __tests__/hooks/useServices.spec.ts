import { useServices, init } from "@/index";
import context from "@/global/context";

global.fetch = jest.fn(() => ({
  status: 200,
  json: () => Promise.resolve(),
  data: {},
})) as jest.Mock;

enum Api {
  test = "/test",
}

describe("useServices: without init", () => {
  it("should throw an error if not initialized first", () => {
    expect(() => useServices<typeof Api>()).toThrow(
      "init must be called before using useServices hook"
    );
  });
});

describe("useServices", () => {
  beforeEach(() => {
    init({ baseURL: "http://api.test.com", endpoints: Api });
  });

  it("should return the context.useServices object", () => {
    const result = useServices<typeof Api>();
    expect(result).toHaveProperty("test");
  });

  it("should return an instance of ServiceResponse", async () => {
    const { test } = useServices<typeof Api>();
    const r = await test.get();
    expect(r).toHaveProperty("data");
  });

  it("should make a GET request", async () => {
    const { test } = useServices<typeof Api>();
    const res = await test.get();
    expect(res?.status).toBe(200);
  });

  it("should make a POST request", async () => {
    const { test } = useServices<typeof Api>();
    const res = await test.post({ data: "test" });
    expect(res?.status).toBe(200);
  });

  it("should make a PUT request", async () => {
    const { test } = useServices<typeof Api>();
    const res = await test.put({});
    expect(res?.status).toBe(200);
  });

  it("should make a DELETE request", async () => {
    const { test } = useServices<typeof Api>();
    const res = await test.delete();
    expect(res?.status).toBe(200);
  });

  it("should make a PATCH request", async () => {
    const { test } = useServices<typeof Api>();
    const res = await test.patch([{ op: "add", path: "/test", value: "test" }]);
    expect(res?.status).toBe(200);
  });

  it("should make a request with query params", async () => {
    const { test } = useServices<typeof Api>();
    const res = await test.get({ query: { test: "test" } });
    expect(res?.status).toBe(200);
  });
});
