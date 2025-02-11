import type { Context } from "@/types";

const context = globalThis as unknown as Context;

export default () => context.useRequests;
