import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

export class HttpClient {
  public static createInstance(baseURL: string, headers: AxiosRequestConfig['headers'] = {}): AxiosInstance {
    const instance = axios.create({
      baseURL,
      headers,
      timeout: 10 * 1000
    });

    axiosRetry(instance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500
    });

    return instance;
  }
}
