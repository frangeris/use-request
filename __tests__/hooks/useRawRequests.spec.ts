import { useRawRequest } from "@/index";
import Service from "@/core/service";

global.fetch = jest.fn(() => ({
  status: 200,
  json: () => Promise.resolve(),
  data: {},
})) as jest.Mock;

describe("useRawRequest", () => {
  it("should return a function", async () => {
    const raw = useRawRequest();
    expect(raw).toBeDefined();
    expect(raw).toBeInstanceOf(Function);
  });

  it("should return an instance of service", async () => {
    const raw = useRawRequest();
    expect(raw("http://api.example.io/example")).toBeInstanceOf(Service);
  });

  it("should make a GET request", async () => {
    const raw = useRawRequest();
    const res = await raw("http://api.test.com").get();
    expect(res?.status).toBe(200);
  });

  it("should make a POST request", async () => {
    const raw = useRawRequest();
    const res = await raw("http://api.test.com").post({});
    expect(res?.status).toBe(200);
  });

  it("should make a PUT request", async () => {
    const raw = useRawRequest();
    const res = await raw("http://api.test.com").put({});
    expect(res?.status).toBe(200);
  });
});

describe("useRawRequest: http methods", () => {
  let raw: ReturnType<typeof useRawRequest>;

  beforeEach(() => {
    raw = useRawRequest();
  });

  it("should make a GET request", async () => {
    const res = await raw("http://api.test.com").get();
    expect(res?.status).toBe(200);
  });

  it("should make a POST request", async () => {
    const res = await raw("http://api.test.com").post({});
    expect(res?.status).toBe(200);
  });

  it("should make a PUT request", async () => {
    const res = await raw("http://api.test.com").put({});
    expect(res?.status).toBe(200);
  });

  it("should make a DELETE request", async () => {
    const res = await raw("http://api.test.com").delete();
    expect(res?.status).toBe(200);
  });

  it("should make a PATCH request", async () => {
    const res = await raw("http://api.test.com").patch([
      { op: "add", path: "/test", value: "test" },
    ]);
    expect(res?.status).toBe(200);
  });
});
