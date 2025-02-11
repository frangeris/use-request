import { RequestPath, ServiceConfig, ServiceResponse } from "@/types";
import Config from "@/global/config";

export class Service<P> {
  private resource?: string;
  private controller: AbortController;

  constructor(resource?: string) {
    if (resource) {
      this.resource = resource;
    }

    this.controller = new AbortController();
  }

  private buildUrl(path?: RequestPath<P>): string {
    const ESCAPED = "___ESCAPED___";

    // when no resource, a raw request
    let url = this.resource ?? "";

    // no need to build path
    if (typeof path === "string") {
      return url + path;
    }

    // not path provided, plain url
    if (!path) {
      return url;
    }

    // build complex path
    const { params, query, path: customPath } = path;
    if (customPath) {
      url += customPath;
    }

    // replace path parameters
    url = url.replace(/\\:/g, ESCAPED);
    const toReplace = params as { [k: string]: string | number };
    for (const k in toReplace) {
      url = url.replace(`:${k}`, toReplace[k].toString());
    }

    if (query) {
      const params = Object.entries(query).map(([k, v]) => [k, v.toString()]);
      const qs = new URLSearchParams(params);
      url += `?${decodeURIComponent(qs.toString())}`;
    }

    // check for missing params
    const missingParams = url.match(/:[a-zA-Z0-9]+/g);
    if (missingParams) {
      throw new Error(`Missing parameters ${missingParams.join(", ")}`);
    }

    // remove escaped
    return url.replace(ESCAPED, ":");
  }

  private buildRequest(req: RequestInit & { path?: RequestPath<P> }): Request {
    let baseURL = "";
    const { baseURL: initialURL, headers, useBaseURL } = Config.instance();

    // for normal requests (not raw), base url is required
    if (useBaseURL) {
      if (!initialURL) {
        throw new Error("Missing `baseURL` url in options");
      }
      baseURL = initialURL;
    }

    const { path, ...rest } = req;
    const url = baseURL + this.buildUrl(path);
    const request = new Request(url, {
      headers,
      signal: this.controller.signal,
      ...rest,
    });

    return request;
  }

  private buildResponse<T>(res: Response | null) {
    if (!res) {
      return new Response(null, { status: 500 }) as ServiceResponse<T>;
    }

    // gets populated only when acceded
    Object.defineProperty(res, "data", {
      get() {
        return (async () => {
          try {
            const data = (await res.json()) as { data: T };
            return data?.data ?? null;
          } catch (err) {
            return null;
          }
        })();
      },
      enumerable: true,
      configurable: false,
    });

    return res as ServiceResponse<T>;
  }

  private async makeRequest(req: Request): Promise<Response | null> {
    const { interceptors, headers } = Config.instance();
    let res = null;

    try {
      res = await fetch(req, { headers });
      if (interceptors?.onResponse) {
        interceptors.onResponse(res);
      }
    } catch (err) {
      interceptors?.onError?.(res!);

      // if (this.config?.throwOnError) {
      //   throw err;
      // }
    }

    return res;
  }

  // HTTP methods
  async get<T>(path?: RequestPath<P>) {
    const req = this.buildRequest({ path, method: "GET" });
    const res = await this.makeRequest(req);

    return this.buildResponse<T>(res);
  }

  async post<T>(
    payload: any,
    path?: RequestPath<P>
  ): Promise<ServiceResponse<T>> {
    const req = await this.buildRequest({
      path,
      method: "POST",
      body: JSON.stringify(payload),
    });
    const res = await this.makeRequest(req);

    return this.buildResponse<T>(res);
  }

  async put<T>(
    payload: any,
    path?: RequestPath<P>
  ): Promise<ServiceResponse<T>> {
    const req = await this.buildRequest({
      path,
      method: "PUT",
      body: JSON.stringify(payload),
    });
    const res = await this.makeRequest(req);

    return this.buildResponse<T>(res);
  }

  async delete<T>(path?: RequestPath<P>): Promise<ServiceResponse<T>> {
    const req = await this.buildRequest({ path, method: "DELETE" });
    const res = await this.makeRequest(req);

    return this.buildResponse<T>(res);
  }

  async patch<T>(
    ops: {
      path: string;
      op: "add" | "remove" | "replace" | "move" | "copy" | "test";
      value?: any;
    }[],
    path?: RequestPath<P>
  ): Promise<ServiceResponse<T>> {
    const req = await this.buildRequest({
      path,
      method: "PATCH",
      body: JSON.stringify(ops),
    });
    const res = await this.makeRequest(req);

    return this.buildResponse<T>(res);
  }
}

export default Service;
