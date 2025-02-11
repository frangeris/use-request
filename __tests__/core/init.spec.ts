import type { Context } from "@/types";
import { init } from "@/core/init";
import Service from "@/core/service";
import Config from "@/global/config";
import useServices from "@/hooks/useServices";

enum Test {
  endpoint1 = "/endpoint1",
  endpoint2 = "/endpoint2",
  endpoint3 = "/endpoint3",
}

describe("init", () => {
  const baseURL = "http://api.example.io";
  beforeEach(() => {
    jest.clearAllMocks();
    init({ baseURL, endpoints: Test });
  });

  it("should set the baseURL correctly", () => {
    expect(Config.instance().baseURL).toBe(baseURL);
  });

  it("should define globalThis.useRequests correctly", () => {
    const ctx = globalThis as unknown as Context;
    expect(ctx.useRequests).toBeDefined();
  });

  it("should create services correctly", () => {
    const svs = useServices<typeof Test>();
    expect(svs.endpoint1).toBeDefined();
    expect(svs.endpoint1).toBeInstanceOf(Service);

    expect(svs.endpoint2).toBeDefined();
    expect(svs.endpoint2).toBeInstanceOf(Service);

    expect(svs.endpoint3).toBeDefined();
    expect(svs.endpoint3).toBeInstanceOf(Service);
  });
});
