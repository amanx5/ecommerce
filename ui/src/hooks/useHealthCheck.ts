import { hitRequest } from "@/utils/api-request";
import { useQuery } from "@tanstack/react-query";

export function useHealthCheck() {
  const queryResult = useQuery({
    queryKey: ["health-check"],
    retry: false,
    queryFn: getHealthCheck,
  });

  return queryResult;
}

async function getHealthCheck() {
  const { response, error } = await hitRequest({
    endpoint: "/",
    method: "head",
  });

  if (!response) {
    throw new Error("Unable to connect to the server", { cause: error });
  }

  if (!response.status || response.status < 200 || response.status >= 300) {
    throw new Error("Internal Server Error");
  }

  // queryFn must return something, otherwise useQuery will throw an error.
  return true;
}
