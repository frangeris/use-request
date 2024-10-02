import Options from "./options";
import { ServiceResponse, RequestPath, PatchOperation } from "./types";

export class Service {
  public headers: Headers = new Headers();

  private baseURL: string;
  private resource: string;
  private controller: AbortController;

  constructor(resource: string) {
    const opts = Options.instance().opts;
    if (!opts) {
      throw new Error("Options not initialized, use initServices");
    }

    this.baseURL = opts?.baseURL;
    this.resource = resource;
    this.controller = new AbortController();
  }

  private request(
    opts: RequestInit & { path?: RequestPath }
  ): Promise<Response> {
    const { path, ...rest } = opts;
    const { baseURL, headers } = this;
    const url = baseURL + this.build(path);
    const request = new Request(url, {
      headers,
      signal: this.controller.signal,
      ...rest,
    });

    return fetch(request);
  }

  private build(path?: RequestPath) {
    if (!path) {
      return "";
    }

    if (typeof path === "string") {
      return path;
    }

    // build complex path
    let url = this.resource;
    const { params, query } = path;
    if (params) {
      for (const k in params) {
        url = url.replace(`:${k}`, `${params[k]}`);
      }
    } else if (url.includes(":")) {
      throw new Error("Missing path parameters");
    }

    if (query) {
      const params = Object.entries(query).map(([k, v]) => [k, v.toString()]);
      const qs = new URLSearchParams(params);
      url += `?${qs.toString()}`;
    }

    return url;
  }

  private async response<T>(request: Response): ServiceResponse<T> {
    return {
      ...request,
      data: (await request.json()) as T,
    };
  }

  // HTTP methods
  async get<T>(path?: RequestPath): ServiceResponse<T> {
    const request = await this.request({
      path,
      method: "get",
    });

    return this.response<T>(request);
  }

  /*
	async head(path?: RequestPath): Promise<Response> {
		const request = await this.request({
			path,
			method: "head",
		});

		return this.response<void>(request);
	}

	async post<T>(payload: any, path?: RequestPath): ServiceResponse<T> {
		const request = await this.request({
			path,
			method: "post",
			body: JSON.stringify(payload),
		});

		return this.response<T>(request);
	}

	async put<T>(payload: any, path?: RequestPath): ServiceResponse<T> {
		const request = await this.request({
			path,
			method: "put",
			body: JSON.stringify(payload),
		});

		return this.response<T>(request);
	}

	async delete<T>(path?: RequestPath): ServiceResponse<T> {
		const request = await this.request({
			path,
			method: "delete",
		});

		return this.response<T>(request);
	}

	async patch<T>(
		ops: PatchOperation[],
		path?: RequestPath
	): ServiceResponse<T> {
		const request = await this.request({
			path,
			method: "patch",
		});

		return this.response<T>(request);
	}

  private abort() {
    this.controller.abort();
  }

		*/
}

export default Service;
