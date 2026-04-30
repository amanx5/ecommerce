import { isString, isObject } from "@/utils/data-types";
import { isDevMode, isTestMode } from "@/utils/environment";
import type { SetToast } from "@/context/AppContext";

import axios, { AxiosResponse } from "axios";
import type { Dispatch, SetStateAction } from "react";

function getBackendUrl(): string {
  const key = "VITE_BACKEND_URL";

  let backEndUrl = import.meta.env[key];

  if (!isString(backEndUrl)) {
    if (isTestMode()) {
      backEndUrl = "";
    } else if (isDevMode()) {
      backEndUrl = "http://localhost:5000";
    } else {
      throw new Error("Application Error", {
        cause: `Missing env variable: ${key}`,
      });
    }
  }

  // remove trailing slashes to avoid double slashes when joining with endpoint
  return backEndUrl.trim().replace(/\/+$/, "");
}

export function getEndpointUrl(endpoint: string): string {
  if (!endpoint || isTestMode()) return endpoint;

  // Already absolute (http/https) — return as-is
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://"))
    return endpoint;

  // remove leading slashes to make the endpoint relative
  const relativeEndpoint = endpoint.replace(/^\/+/, "");

  // join with base backend url
  const finalUrl = getBackendUrl() + "/" + relativeEndpoint;
  return finalUrl;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

type RequestOptions = {
  method: "get" | "post" | "put" | "delete";
  data?: unknown;
};

// this property instructs the browser to attach any cookies (of the Host domain(server)) to the request,
// and store any cookies the server sends back.
// this is same as setting {"credentials": "include"} in the fetch() API.
// axios internally uses xhr and sets the withCredentials property on it
// this is required now since frontend and backend are on different origins
// this is basically client requesting for a handshake with the server
axios.defaults.withCredentials = true;

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions,
): Promise<ApiResponse<T>>;
export async function apiRequest(
  endpoint: string,
  options: RequestOptions,
  sendFullResponse?: true,
): Promise<AxiosResponse>;

/**
 * Makes an HTTP request to the given API endpoint using Axios.
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions,
  sendFullResponse?: true,
): Promise<ApiResponse<T> | AxiosResponse> {
  const { method, data } = options;
  const url = getEndpointUrl(endpoint);

  try {
    let response: AxiosResponse<ApiResponse<T>>;
    if (method === "delete") {
      response = await axios.delete(url);
    } else if (method === "put") {
      response = await axios.put(url, data);
    } else if (method === "post") {
      response = await axios.post(url, data);
    } else {
      response = await axios.get(url);
    }

    return sendFullResponse ? response : response.data;
  } catch (error) {
    console.error("API Request Error: ", error);
    const message =
      isObject(error) &&
      "response" in error &&
      isObject(error.response) &&
      "data" in error.response &&
      isObject(error.response.data) &&
      "message" in error.response.data &&
      isString(error.response.data.message)
        ? error.response.data.message
        : "Request failed. Please try again later."; // generic message irrespective of whether the request was to get data or perform some action

    return {
      success: false,
      message,
    };
  }
}

type ToastOptions =
  | false
  | {
      setToast: SetToast;
      when: "always" | "onSuccess" | "onFailure";
    };

export const refreshStateViaAPI = async function <T>(
  api: string,
  setData: Dispatch<SetStateAction<T>>,
  toastOptions: ToastOptions,
): Promise<ApiResponse<T>> {
  const response = await apiRequest<T>(api, { method: "get" });
  const { data, message, success } = response;

  if (data && success) {
    setData(data);
  }

  if (
    message &&
    toastOptions &&
    (toastOptions.when === "always" ||
      (toastOptions.when === "onSuccess" && success) ||
      (toastOptions.when === "onFailure" && !success))
  ) {
    toastOptions.setToast({
      message,
      type: success ? "success" : "error",
    });
  }

  return response;
};
