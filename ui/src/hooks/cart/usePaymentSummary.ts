import { useQueryUser } from "@/hooks/user/useQueryUser";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/utils/api-request";
import { API_ENDPOINTS } from "@/utils/api-endpoint";
import type { PaymentSummaryData } from "@/types";

export function usePaymentSummary() {
  const { data: user } = useQueryUser();

  return useQuery({
    queryKey: ["paymentSummary"],
    queryFn: getPaymentSummary,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

async function getPaymentSummary(): Promise<PaymentSummaryData> {
  const resp = await apiRequest<PaymentSummaryData>({
    endpoint: API_ENDPOINTS.paymentSummary.GET,
  });

  if (resp.success && resp.data) {
    return resp.data;
  } else {
    throw new Error(resp.message || "Failed to fetch payment summary.");
  }
}
