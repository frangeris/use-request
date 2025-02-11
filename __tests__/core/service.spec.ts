import Service from "@/core/service";
import Config from "@/global/config";

describe("service", () => {
  beforeEach(() => {
    Config.instance = jest.fn().mockReturnValue({
      baseURL: "https://api.example.com",
      useBaseURL: true,
    });
  });

  describe("buildUrl", () => {
    it("should return nothing when no path and resource are provided", () => {
      const service = new Service();
      const url = service["buildUrl"]();
      expect(url).toBe("");
    });

    it("should return resource if no path is provided", () => {
      const service = new Service("/resource");
      const url = service["buildUrl"]();
      expect(url).toBe("/resource");
    });

    it("should return the path and resource", () => {
      const service = new Service("/resource");
      const url = service["buildUrl"]("/path");
      expect(url).toBe("/resource/path");
    });

    it("should return use the path property", () => {
      const service = new Service("/resource");
      const url = service["buildUrl"]({ path: "/another" });
      expect(url).toBe("/resource/another");
    });

    it("should replace parameters in resource", () => {
      const service = new Service("/resource/:id");
      const url = service["buildUrl"]({ params: { id: "123" } });
      expect(url).toBe("/resource/123");
    });

    it("should throw error if one path parameters are missing", () => {
      const service = new Service("/resource/:id");
      expect(() => service["buildUrl"]({})).toThrow("Missing parameters :id");
    });

    it("should throw error if multiple path parameters are missing", () => {
      const service = new Service("/resource/:a/test/:b/test/:c");
      expect(() => service["buildUrl"]({})).toThrow(
        "Missing parameters :a, :b, :c"
      );
    });

    it("should include query parameters", () => {
      const service = new Service("/resource");
      const url = service["buildUrl"]({ query: { search: "test" } });
      expect(url).toBe("/resource?search=test");
    });

    it("should build a URL with both path and query parameters", () => {
      const service = new Service("/resource/:id");
      const url = service["buildUrl"]({
        params: { id: "123" },
        query: { search: "test" },
      });
      expect(url).toBe("/resource/123?search=test");
    });

    it("should escape path parameters", () => {
      const service = new Service(`/resource\:top`);
      const url = service["buildUrl"]();
      expect(url).toBe("/resource:top");
    });
  });

  describe("buildRequest", () => {
    it("should construct a Request object correctly", () => {
      const service = new Service("/resource");
      const req = service["buildRequest"]({ method: "GET", path: "/hello" });
      expect(req.url).toBe("https://api.example.com/resource/hello");
    });

    // it("should throw an error if baseURL is not provided", () => {
    //   Config.instance = jest.fn().mockReturnValue({});
    //   const service = new Service("/resource");
    //   expect(() => service["buildRequest"]({ method: "GET" })).toThrow(
    //     "Missing `base` url in options"
    //   );
    // });

    // it("should use the resource as baseURL when `useBaseURL` is false", async () => {
    //   const url = "https://api.example.com/resource";
    //   Config.instance().useBaseURL = false;
    //   const service = new Service(url);
    //   const req = await service["buildRequest"]({ method: "GET" });
    //   expect(req.url).toBe(url);
    // });
  });

  describe("buildResponse", () => {
    it("should return data undefined when body is not present", async () => {
      const service = new Service("/resource");
      const res = await service["buildResponse"](new Response());
      expect(await res?.data).toBeNull();
    });

    it("should return an object with data", async () => {
      const dummy = { data: { key: "value" } };
      const service = new Service("/resource");
      const res = await service["buildResponse"](
        new Response(JSON.stringify(dummy))
      );
      expect(await res?.data).toEqual(dummy.data);
    });
  });
});
