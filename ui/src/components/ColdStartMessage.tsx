import { API_ENDPOINTS } from "@/utils";

export function ColdStartMessage() {
  const healthCheckApi = API_ENDPOINTS.healthcheck.GET;

  return (
    <div className="flex flex-col gap-1.5 p-0.5">
      <span className="font-bold text-gray-800 block">
        Waking up the shop... ☕
      </span>
      <span className="text-sm text-gray-600 leading-snug block">
        We haven't had a visitor in a little while, so our servers are just
        warming up for you. It should only take a few more seconds!
      </span>
      <div className="mt-1 pt-2 border-t border-gray-100">
        <a
          href={healthCheckApi}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-(--primary-green) hover:underline font-semibold"
        >
          Check live server status →
        </a>
      </div>
    </div>
  );
}

