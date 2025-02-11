import type { Context } from "@/types";
import context from "@/global/context";
import init from "@/core/init";

const dummy: Context = {
  useRequests: {
    config: { baseURL: "https://test.io", endpoints: {} },
    services: {},
  },
};

describe("global context", () => {
  beforeEach(() => {
    init({ baseURL: "https://test.io", endpoints: {} });
  });

  it("should return the useRequests property from globalThis", () => {
    const result = context();
    expect(result).toEqual(dummy.useRequests);
  });
});
