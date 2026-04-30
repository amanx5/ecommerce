export const isTestMode = function (): boolean {
  return import.meta.env.NODE_ENV === "test";
};

export const isDevMode = function (): boolean {
  return import.meta.env.DEV;
};

export const warnDev = function (msg: string): void {
  if (isDevMode()) {
    console.warn(msg);
  }
};
