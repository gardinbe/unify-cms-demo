import { stringify } from 'qs';
import type { DeepRequired } from 'ts-essentials';
import { mergeDeepRight } from 'ramda';

export interface ExtendedRequestOptions<
	TRequestParams extends object = object
> extends RequestInit {
	params?: TRequestParams;
}

/**
 * Options for an API service.
 */
export interface ApiServiceOptions {
	/**
	 * Hostname of the API.
	 */
	hostname: string;
	/**
	 * Base URL path of the API. This will be appended to the hostname
	 * on every request.
	 *
	 * Include a leading, **but not a trailing slash - it's automatically appended**.
	 * @defaultValue
	 * ```typescript
	 *	null
	 * ```
	 */
	basePath?: string | null;
	/**
	 * Base request options.
	 *
	 * Any subsequently passed parameters will be deeply merged with these.
	 * @defaultValue
	 * ```typescript
	 *	null
	 * ```
	 */
	baseRequestOptions?: ExtendedRequestOptions | null;
}

/**
 * A service for handling and performing API requests.
 *
 * Based on the Fetch API.
 */
export class ApiService<
	TBaseResponseData extends object = object,
	TBaseRequestParams extends object = object,
	TBaseRequestOptions extends ExtendedRequestOptions<TBaseRequestParams> = ExtendedRequestOptions<TBaseRequestParams>
> {
	static createOptions(options: ApiServiceOptions): DeepRequired<ApiServiceOptions> {
		return mergeDeepRight(
			{
				basePath: null,
				timeout: null,
				ssgRevalidationInterval: 60,
				baseRequestOptions: null
			},
			options
		) as DeepRequired<ApiServiceOptions>;
	}

	protected readonly options: DeepRequired<ApiServiceOptions>;

	/**
	 * Creates a new API service instance.
	 * @param options - Options
	 */
	constructor(options: ApiServiceOptions) {
		this.options = ApiService.createOptions(options);
	}

	/**
	 * Sends a **GET** request to the API.
	 * @param endpoint - Target endpoint
	 * @param options - Fetch request options
	 * @returns Response data
	 * @throws Error if request failed or took too long
	 */
	async get<
		TResponseData extends TBaseResponseData = TBaseResponseData,
		TRequestOptions extends TBaseRequestOptions = TBaseRequestOptions
	>(
		endpoint: string,
		options?: Omit<TRequestOptions, 'method' | 'body'>
	) {
		return this.sendRequest<TResponseData, TRequestOptions>(endpoint, { ...options, method: 'GET' } as TRequestOptions);
	}

	/**
	 * Sends a **POST** request to the API.
	 * @param endpoint - Target endpoint
	 * @param body - Body content
	 * @param options - Fetch request options
	 * @returns Response data
	 * @throws Error if request failed or took too long
	 */
	async post<
		TResponseData extends TBaseResponseData = TBaseResponseData,
		TRequestOptions extends TBaseRequestOptions = TBaseRequestOptions
	>(
		endpoint: string,
		body: BodyInit,
		options?: Omit<TRequestOptions, 'method' | 'body'>
	) {
		return this.sendRequest<TResponseData, TRequestOptions>(endpoint, { ...options, method: 'POST', body } as TRequestOptions);
	}

	/**
	 * Sends a **POST** request **with a JSON body** to the API.
	 *
	 * The body is stringified, and the `Content-Type` header is set to `application/json`
	 * automatically.
	 * @param endpoint - Target endpoint
	 * @param obj - JSON object
	 * @param options - Fetch request options
	 * @returns Response data
	 * @throws Error if request failed or took too long
	 */
	async postJson<
		TResponseData extends TBaseResponseData = TBaseResponseData,
		TRequestOptions extends TBaseRequestOptions = TBaseRequestOptions
	>(
		endpoint: string,
		obj: object,
		options?: Omit<TRequestOptions, 'method' | 'body'>
	) {
		return this.sendRequest<TResponseData, TRequestOptions>(endpoint, mergeDeepRight(options ?? {}, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(obj)
		}) as TRequestOptions);
	}

	/**
	 * Sends a **PUT** request to the API.
	 * @param endpoint - Target endpoint
	 * @param body - Body content
	 * @param options - Fetch request options
	 * @returns Response data
	 * @throws Error if request failed or took too long
	 */
	async put<
		TResponseData extends TBaseResponseData = TBaseResponseData,
		TRequestOptions extends TBaseRequestOptions = TBaseRequestOptions
	>(
		endpoint: string,
		body: BodyInit,
		options?: Omit<TRequestOptions, 'method' | 'body'>
	) {
		return this.sendRequest<TResponseData, TRequestOptions>(endpoint, { ...options, method: 'PUT', body } as TRequestOptions);
	}

	/**
	 * Sends a **PUT** request **with a JSON body** to the API.
	 *
	 * The body is stringified, and the `Content-Type` header is set to `application/json`
	 * automatically.
	 * @param endpoint - Target endpoint
	 * @param obj - JSON object
	 * @param options - Fetch request options
	 * @returns Response data
	 * @throws Error if request failed or took too long
	 */
	async putJson<
		TResponseData extends TBaseResponseData = TBaseResponseData,
		TRequestOptions extends TBaseRequestOptions = TBaseRequestOptions
	>(
		endpoint: string,
		obj: object,
		options?: Omit<TRequestOptions, 'method' | 'body'>
	) {
		return this.sendRequest<TResponseData, TRequestOptions>(endpoint, mergeDeepRight(options ?? {}, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(obj)
		}) as TRequestOptions);
	}

	/**
	 * Sends a **PATCH** request to the API.
	 * @param endpoint - Target endpoint
	 * @param body - Body content
	 * @param options - Fetch request options
	 * @returns Response data
	 * @throws Error if request failed or took too long
	 */
	async patch<
		TResponseData extends TBaseResponseData = TBaseResponseData,
		TRequestOptions extends TBaseRequestOptions = TBaseRequestOptions
	>(
		endpoint: string,
		body: BodyInit,
		options?: Omit<TRequestOptions, 'method' | 'body'>
	) {
		return this.sendRequest<TResponseData, TRequestOptions>(endpoint, { ...options, method: 'PATCH', body } as TRequestOptions);
	}

	/**
	 * Sends a **PATCH** request **with a JSON body** to the API.
	 *
	 * The body is stringified, and the `Content-Type` header is set to `application/json`
	 * automatically.
	 * @param endpoint - Target endpoint
	 * @param obj - JSON object
	 * @param options - Fetch request options
	 * @returns Response data
	 * @throws Error if request failed or took too long
	 */
	async patchJson<
		TResponseData extends TBaseResponseData = TBaseResponseData,
		TRequestOptions extends TBaseRequestOptions = TBaseRequestOptions
	>(
		endpoint: string,
		obj: object,
		options?: Omit<TRequestOptions, 'method' | 'body'>
	) {
		return this.sendRequest<TResponseData, TRequestOptions>(endpoint, mergeDeepRight(options ?? {}, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(obj)
		}) as TRequestOptions);
	}

	/**
	 * Sends a **DELETE** request to the API.
	 * @param endpoint - Target endpoint
	 * @param options - Fetch request options
	 * @returns Response data
	 * @throws Error if request failed or took too long
	 */
	async delete<
		TResponseData extends TBaseResponseData = TBaseResponseData,
		TRequestOptions extends TBaseRequestOptions = TBaseRequestOptions
	>(
		endpoint: string,
		options?: Omit<TRequestOptions, 'method' | 'body'>
	) {
		return this.sendRequest<TResponseData, TRequestOptions>(endpoint, { ...options, method: 'DELETE' } as TRequestOptions);
	}

	async sendRequest<
		TResponseData extends TBaseResponseData = TBaseResponseData,
		TRequestOptions extends TBaseRequestOptions = TBaseRequestOptions
	>(
		endpoint: string,
		options?: TRequestOptions
	): Promise<TResponseData> {
		const _params = mergeDeepRight(
			this.options.baseRequestOptions?.params ?? {},
			options?.params ?? {}
		);

		const encodedParams = stringify(_params);

		const url = `${this.options.hostname}${this.options.basePath ?? ''}/${endpoint}${encodedParams ? `?${encodedParams}` : ''}`;

		//TODO: allow request cancellation here
		const response = await fetch(url, options);

		const data = await response.json() as TResponseData;

		return data;
	}
}
