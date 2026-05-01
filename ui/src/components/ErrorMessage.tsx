export function ErrorMessage({ error }: { error: unknown }) {
  const message =
    error instanceof Error ? error.message : "An unknown error occurred";

  return <div>{message}</div>;
}
