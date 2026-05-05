import { ErrorMessage } from "@/components/ErrorMessage";
import type { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorMessage error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
}
