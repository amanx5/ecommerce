import { apiRequest, type ApiResponseBody } from "@/utils/api-request";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "react-hot-toast";

type ToastOptions =
  | false
  | {
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
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }

  return response;
};

