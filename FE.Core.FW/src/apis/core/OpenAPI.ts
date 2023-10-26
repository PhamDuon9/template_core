/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

type Config = {
    BASE: string;
    VERSION: string;
    TOKEN?: string | Resolver<string>;
    APIKEY?: string | Resolver<string>;
    PASSWORD?: string | Resolver<string>;
    HEADERS?: Headers | Resolver<Headers>;
    ENCODE_PATH?: (path: string) => string;
}

export const OpenAPI: Config = {
    BASE: import.meta.env.VITE_SERVER_BE,
    VERSION: '1',
    TOKEN: localStorage.getItem('access_token') || '',
    HEADERS: undefined,
    ENCODE_PATH: undefined,
    APIKEY: import.meta.env.VITE_APIKEY,
};