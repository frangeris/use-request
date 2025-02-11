import { Services } from "@/types";
import context from "@/global/context";

export function useServices<T>() {
  const ctx = context?.();
  if (!ctx) {
    throw new Error("init must be called before using useServices hook");
  }

  return ctx.services as Services<T>;
}

export default useServices;
