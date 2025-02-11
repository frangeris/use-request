import { ServiceConfig, ServiceInterceptors } from "@/types";

export class Config implements ServiceConfig {
  static #instance: Config;

  baseURL: string;
  endpoints: Record<string, string>;
  interceptors: ServiceInterceptors;
  headers: Headers;
  useBaseURL?: boolean;

  private constructor(config?: ServiceConfig) {
    this.baseURL = "";
    this.useBaseURL = true;
    this.endpoints = {};
    this.interceptors = {};
    this.headers = new Headers();

    if (config) {
      Object.assign(this, config);
    }
  }

  public static instance(config?: ServiceConfig): Config {
    if (!Config.#instance) {
      Config.#instance = new Config(config);
    }
    return Config.#instance;
  }
}

export default Config;
