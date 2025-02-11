import { init, useRawRequest, useRequestsConfig, useServices } from "../src";

const baseURL = "https://jsonplaceholder.typicode.com";

// can be defined globally
enum Api {
  posts = "/posts",
  comments = "/comments",
}

init({ baseURL, endpoints: Api });

const { interceptors, headers } = useRequestsConfig();
interceptors.onResponse = (r) => {
  console.log(r.status, r.url);
};

const typed = async () => {
  console.info("✨ Typed requests");
  const { posts, comments } = useServices<typeof Api>();

  await posts.get();
  await posts.post({});
  await posts.put({}, { path: "/:id", params: { id: 1 } });
  await posts.patch([{ op: "add", path: "/tests", value: true }], {
    path: "/:id",
    params: { id: 1 },
  });
  await posts.delete({ path: "/:id", params: { id: 1 } });
  await posts.get({ path: "/:id/comments", params: { id: 1 } });

  // custom headers
  headers.set("x-test", "value");
  await comments.get({ query: { postId: 1 } });
};

// same requests can be done with raw requests
const raw = async () => {
  console.info("\n", "⚡️ Raw requests");
  const raw = useRawRequest();
  const r = await raw(baseURL);
  await r.get("/posts");

  // parameters in url are also supported and can be passed as an object too
  // but it doesn't throw an error if the parameter is not passed, so params
  // are not required
  await r.get({
    path: "/posts/:id",
    params: { id: 1 },
  });
  await r.get({
    path: `/posts/:id\\:top`,
    params: { id: 1 },
    query: {
      test: [1, 2, 3].join(","),
    },
  });
};

// run all examples sequentially
(async () => {
  await typed();
  await raw();
})();
