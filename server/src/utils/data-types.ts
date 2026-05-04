export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export type ArrayOfType = "string" | "number" | "boolean";
export type ArrayOfTypeValidator = (element: unknown) => boolean;
export const ArrayOfValidators: Record<ArrayOfType, ArrayOfTypeValidator> = {
  string: isString,
  number: isNumber,
  boolean: isBoolean,
};

export function isArrayOf(type: ArrayOfType, value: unknown) {
  if (!isArray(value)) {
    return false;
  }

  const validator = ArrayOfValidators[type];
  return value.every(validator);
}

export function findFirstNotIn<T extends string>(
  array: T[],
  validItems: T[],
): T | undefined {
  const validSet = new Set(validItems);
  return array.find((el) => !validSet.has(el));
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}
