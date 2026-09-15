import { getEndpointUrl } from "@/utils/api-endpoint";
import axios, { AxiosResponse, type AxiosError } from "axios";

// this property instructs the browser to attach the auth cookie to the
// request and store any cookies the server sends back.
// this is same as setting {"credentials": "include"} in the fetch() API.
// axios internally uses xhr and sets the withCredentials property on it
// the UI and API share one origin, so this is just belt-and-braces for the
// cookie-authenticated requests (and required when VITE_BACKEND_URL points
// at a remote API during debugging).
axios.defaults.withCredentials = true;

type RequestOptions = {
  endpoint: string;
  method?: "head" | "get" | "post" | "put" | "delete";
  payload?: unknown;
};

type AxiosErrorWithoutResponse = Omit<AxiosError, "response">;

type RequestResultWithResponse = {
  response: AxiosResponse;
  error: null;
};

type RequestResultWithError = {
  response: null;
  error: AxiosErrorWithoutResponse;
};

type RequestResult = Promise<
  RequestResultWithResponse | RequestResultWithError
>;

export async function hitRequest(options: RequestOptions): RequestResult {
  const { endpoint, method = "get", payload } = options;
  const url = getEndpointUrl(endpoint);

  try {
    let response;
    switch (method) {
      case "delete":
        response = await axios.delete(url);
        break;
      case "put":
        response = await axios.put(url, payload);
        break;
      case "post":
        response = await axios.post(url, payload);
        break;
      case "head":
        response = await axios.head(url);
        break;
      default:
        response = await axios.get(url);
    }
    return { response, error: null };
  } catch (err) {
    const { response, ...error } = err as AxiosError;

    if (response) {
      return { response, error: null };
    } else {
      return { response: null, error };
    }
  }
}

export interface ApiResponseBody<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: AxiosErrorWithoutResponse;
}

export async function apiRequest<T>(
  options: RequestOptions,
): Promise<ApiResponseBody<T>> {
  const { response, error } = await hitRequest(options);

  if (response) {
    const responseBody = response.data;

    if (responseBody) {
      return responseBody;
    }

    return { success: true };
  }

  return { success: false, error };
}
