import Config from "@/global/config";

export function useRequestsConfig() {
  return Config.instance();
}

export default useRequestsConfig;
