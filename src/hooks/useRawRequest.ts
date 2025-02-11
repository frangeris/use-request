import Service from "@/core/service";
import Config from "@/global/config";

export function useRawRequest() {
  return (url: string) => {
    Config.instance().useBaseURL = false;
    return new Service(url);
  };
}

export default useRawRequest;
