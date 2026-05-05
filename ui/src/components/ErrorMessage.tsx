import { WarningCircleIcon } from "@phosphor-icons/react";

interface ErrorMessageProps {
  error: unknown;
  resetErrorBoundary?: () => void;
}

export function ErrorMessage({ error, resetErrorBoundary }: ErrorMessageProps) {
  const message =
    error instanceof Error ? error.message : "An unknown error occurred";

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mx-auto flex max-w-sm flex-col items-center">
        <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500 ring-1 ring-red-100 shadow-sm transition-transform hover:scale-105">
          <WarningCircleIcon size={40} weight="duotone" />
        </div>
        <h3 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900">
          Something went wrong
        </h3>
        <p className="mb-4 text-lg leading-relaxed text-zinc-500">
          {message}
        </p>
        <button
          onClick={handleRetry}
          className="group relative inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-12 py-4 text-base font-bold text-white transition-all hover:bg-zinc-800 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}


