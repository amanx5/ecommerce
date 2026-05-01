import { isString } from '@/utils/data-types';
import { isDevMode, isTestMode } from '@/utils/environment';


function getBackendUrl(): string {
	const key = 'VITE_BACKEND_URL';

	let backEndUrl = import.meta.env[key];

	if (!isString(backEndUrl)) {
		if (isTestMode()) {
			backEndUrl = '';
		} else if (isDevMode()) {
			backEndUrl = 'http://localhost:5000';
		} else {
			throw new Error('Application Error', {
				cause: `Missing env variable: ${key}`,
			});
		}
	}

	// remove trailing slashes to avoid double slashes when joining with endpoint
	return backEndUrl.trim().replace(/\/+$/, '');
}

export function getEndpointUrl(endpoint: string): string {
	if (!endpoint || isTestMode()) return endpoint;

	// Already absolute (http/https) — return as-is
	if (endpoint.startsWith('http://') || endpoint.startsWith('https://'))
		return endpoint;

	// remove leading slashes to make the endpoint relative
	const relativeEndpoint = endpoint.replace(/^\/+/, '');

	// join with base backend url
	const finalUrl = getBackendUrl() + '/' + relativeEndpoint;
	return finalUrl;
}


