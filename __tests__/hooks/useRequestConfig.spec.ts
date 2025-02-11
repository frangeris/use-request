import useRequestsConfig from "@/hooks/useRequestsConfig";

describe("useRequestsConfig", () => {
  it("should return a singleton instance", () => {
    const instance1 = useRequestsConfig();
    const instance2 = useRequestsConfig();
    expect(instance1).toBe(instance2);
  });

  it("should set and retrieve baseURL correctly", () => {
    const opts = useRequestsConfig();
    opts.baseURL = "http://example.com";
    expect(opts.baseURL).toBe("http://example.com");
  });

  it("should set and retrieve headers correctly", () => {
    const { headers } = useRequestsConfig();
    headers.set("authorization", "token");
    expect(headers.get("authorization")).toBe("token");
  });
});
