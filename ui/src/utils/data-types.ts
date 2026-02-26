export function isError(value: unknown): value is Error {
	return value instanceof Error;
}

export function isNumber(value: unknown): value is number {
	return typeof value === 'number';
}

export function isString(value: unknown): value is string {
	return typeof value === 'string';
}

export function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}
