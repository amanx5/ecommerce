import type { ToastSetter } from "@/hooks/useToastSetter";
import { apiRequest, type ApiResponseBody } from "@/utils/api-request";
import type { Dispatch, SetStateAction } from "react";

type ToastOptions =
  | false
  | {
      setToast: ToastSetter;
      when: "always" | "onSuccess" | "onFailure";
    };

export const refreshStateViaAPI = async function <T>(
  endpoint: string,
  setData: Dispatch<SetStateAction<T>>,
  toastOptions: ToastOptions,
): Promise<ApiResponseBody<T>> {
  const response = await apiRequest<T>({ endpoint });
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
