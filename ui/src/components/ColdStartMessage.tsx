import { API_ENDPOINTS } from "@/utils/api-endpoint";

export function ColdStartMessage() {
  const healthCheckApi = API_ENDPOINTS.healthcheck.GET;

  return (
    <div className="flex flex-col gap-3 p-1">
      <div className="flex flex-col gap-1">
        <span className="font-bold text-zinc-900 block text-base">
          Loading...
        </span>
        <span className="text-sm text-zinc-500 leading-relaxed block max-w-70">
          This is taking longer than usual. Please wait.
        </span>
      </div>
      <div className="pt-3 border-t border-zinc-100">
        <a
          href={healthCheckApi}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center text-xs text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
        >
          View Status
        </a>
      </div>
    </div>
  );
}
