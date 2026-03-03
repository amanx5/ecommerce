import axios, { AxiosResponse } from 'axios';

import type { Dispatch, SetStateAction } from 'react';
import type { SetToast } from '../context/AppContext';
import { isObject, isString } from './data-types';

export const APP_CONSTANTS = {
	QUANTITY_ADD_MIN_LIMIT_PER_REQUEST: 0,
	QUANTITY_ADD_MAX_LIMIT_PER_REQUEST: 10,
};

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	message?: string;
}

type RequestOptions = {
	method: HttpMethod;
	data?: unknown;
};
type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export async function apiRequest<T>(
	url: string,
	options: RequestOptions,
): Promise<ApiResponse<T>>;
export async function apiRequest(
	url: string,
	options: RequestOptions,
	sendFullResponse?: true,
): Promise<AxiosResponse>;
/**
 * Makes an HTTP request to the given API endpoint using Axios.
 */
export async function apiRequest<T = unknown>(
	url: string,
	options: RequestOptions,
	sendFullResponse?: true,
): Promise<ApiResponse<T> | AxiosResponse> {
	const { method, data } = options;

	try {
		let response: AxiosResponse<ApiResponse<T>>;
		if (method === 'delete') {
			response = await axios.delete(url);
		} else if (method === 'put') {
			response = await axios.put(url, data);
		} else if (method === 'post') {
			response = await axios.post(url, data);
		} else {
			response = await axios.get(url);
		}

		return sendFullResponse ? response : response.data;
	} catch (error) {
		console.error('API Request Error: ', error);
		const message =
			isObject(error) &&
			'response' in error &&
			isObject(error.response) &&
			'data' in error.response &&
			isObject(error.response.data) &&
			'message' in error.response.data &&
			isString(error.response.data.message)
				? error.response.data.message
				: 'Failed to fetch data. Please try again later.';

		return {
			success: false,
			message,
		};
	}
}

export const refreshStateViaAPI = async function <T>(
	api: string,
	setData: Dispatch<SetStateAction<T>>,
	toastOptions:
		| false
		| {
				setToast: SetToast;
				when: 'always' | 'onSuccess' | 'onFailure';
		  },
): Promise<ApiResponse<T>> {
	if (!setData) {
		warnDev('Request not sent. [Setter param is missing]');
		return { success: false };
	}

	const response = await apiRequest<T>(api, { method: 'get' });
	const { data, message, success } = response;

	if (data && success) {
		setData(data);
	}

	if (
		message &&
		toastOptions &&
		(toastOptions.when === 'always' ||
			(toastOptions.when === 'onSuccess' && success) ||
			(toastOptions.when === 'onFailure' && !success))
	) {
		toastOptions.setToast({
			message,
			type: success ? 'success' : 'error',
		});
	}

	return response;
};

export const warnDev = function (msg: string): void {
	if (isDevMode()) {
		console.warn(msg);
	}
};

export const isDevMode = function (): boolean {
	return import.meta.env.MODE !== 'production';
};
