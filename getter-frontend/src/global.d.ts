declare module '*.css';

import 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    skipAuthRedirect?: boolean;
    _retry?: boolean;
  }
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
    _retry?: boolean;
  }
}
