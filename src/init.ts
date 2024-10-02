import Service from "./service";
import Options from "./options";

let gbl = globalThis as unknown as { services: any };

export function init(baseURL: string, endpoints: Record<string, string>) {
  Options.instance().opts = { baseURL };

  const services: Record<string, Service<unknown>> = {};
  for (const endpoint in endpoints) {
    const key = endpoint as keyof typeof endpoints;
    services[key] = new Service<"">(endpoints[endpoint]);
  }

  if (typeof gbl.services === "undefined") {
    Object.defineProperty(globalThis, "services", {
      value: services,
      enumerable: false,
      configurable: true,
      writable: true,
    });
  }
}

export function getServices() {
  return gbl.services;
}

export default init;
