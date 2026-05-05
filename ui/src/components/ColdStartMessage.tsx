import { API_ENDPOINTS } from "@/utils/api-endpoint";

export function ColdStartMessage() {
  const healthCheckApi = API_ENDPOINTS.healthcheck.GET;

  return (
    <div className="flex flex-col gap-3 p-1">
      <div className="flex flex-col gap-1">
        <span className="font-bold text-zinc-900 block text-base">
          Opening the shutter...
        </span>
        <span className="text-sm text-zinc-500 leading-relaxed block max-w-[280px]">
          The shop was resting while you were away. Reopening now—it&apos;ll
          take just a few more seconds!
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
