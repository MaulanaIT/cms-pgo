import axios from "axios";
import localStore from "store";

const HeaderConfig = {
    "Content-Type": "application/json",
    "x-apitoken": process.env.NEXT_PUBLIC_API_TOKEN,
};

const useRequest = () => {
    const instance = axios.create();

    instance
        .interceptors.request.use(async (config) => {
            const storeAuth = await localStore.get(`persist:${process.env.NEXT_PUBLIC_STORAGE_NAME}`)?.auth;

            if (storeAuth) {
                const authData = JSON.parse(storeAuth);

                if (authData?.accessToken && authData?.accessToken !== '') {
                    config.headers.Authorization = `Bearer ${authData?.accessToken}`;
                } else {
                    delete config.headers.Authorization;
                }
            }

            return config;
        });

    instance
        .interceptors.response.use(
            (response) => response,
            async (error) => {
                // const config = error?.config;
                const errorStatus = error?.response?.status;

                if (+errorStatus === 401 && error?.response?.statusText !== 'Unauthorized') {
                    return Promise.reject(error);
                } else {
                    return Promise.reject(error);
                }
            }
        );

    const getRequestHeaders = (customHeaders = {}) => {
        let headers = Object.assign(HeaderConfig, customHeaders);
        return headers;
    }

    const requestMain = (method, url, data, headers = {}) => {
        if (method === 'get') {
            return instance.request({
                url,
                params: data,
                method,
                headers: Object.assign(HeaderConfig, headers),
            });
        }

        return instance.request({
            url,
            data,
            method,
            headers: Object.assign(HeaderConfig, headers),
        });
    }

    const requestGet = (url, params = {}, headers = {}) => {
        return requestMain('get', url, params, getRequestHeaders(headers));
    }

    const requestPost = (url, data, headers = {}) => {
        return requestMain('post', url, data, getRequestHeaders(headers));
    }

    const requestPut = (url, data, headers = {}) => {
        return requestMain('put', url, data, getRequestHeaders(headers));
    }

    const requestPatch = (url, data, headers = {}) => {
        return requestMain('patch', url, data, getRequestHeaders(headers));
    }

    const requestDelete = (url, data, headers = {}) => {
        return requestMain('delete', url, data, getRequestHeaders(headers));
    }

    return {
        requestGet,
        requestPost,
        requestPatch,
        requestPut,
        requestDelete,
    };
}

export default useRequest;