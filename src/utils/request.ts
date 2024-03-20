import axios, { AxiosError } from 'axios'
import { useStore } from '@/store/index'
import { ElMessage } from 'element-plus'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { errorMsg } from './message'

interface myResponseType<T> extends AxiosResponse {
    code: number,
    msg: string,
    data: T
}

const service = axios.create({
  baseURL: 'https://apisix.cloudmind.top',
  timeout: 10000,
  headers: {
    'X-Xh-Env': 'pro',
    'Content-Type': 'application/json'
  }
})

const store = useStore()
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // const localToken = localStorage.getItem('ShortToken')
    if (localStorage.getItem('LongToken') === null && sessionStorage.getItem('LongToken') === null) {
      return config
    }
    else if (localStorage.getItem('LongToken') === null && sessionStorage.getItem('LongToken') !== null) {
      const localToken = sessionStorage.getItem('ShortToken')
      config.headers['Authorization'] = localToken
    }
    else {
      const localToken = localStorage.getItem('ShortToken')
      config.headers['Authorization'] = localToken
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: any) => {
    return response.data
  },
  (error: any) => {
    const status = error.response.status
    if (status === 401) {
      if (localStorage.getItem('isAutoLogin') === "true") {//自动登录情况
        const longToken = localStorage.getItem('LongToken')
        if (longToken) {
          try {
            post('/auth/refreshToken', { longToken })
            .then((res: any) => {
              if (res !== undefined) {
                const userId = localStorage.getItem('UserId') as string
                store.setUserLocal (res.shortToken, res.longToken, userId)
                return service(error.config)
              }
              else {
                store.loginOut()
                ElMessage.error('登录过期，请重新登录')
              }
            })
          }
          catch (error: any) {
            errorMsg(error)
          }
        }
        else {
          store.loginOut()
          ElMessage.error('请前往登录')
        }
      }
      else if (sessionStorage.getItem('isAutoLogin') === "false") {
        const longToken = sessionStorage.getItem('LongToken')
        post('/auth/refreshToken', { longToken })
        .then((res: any) => {
          const userId = sessionStorage.getItem('UserId') as string
          store.setUserSession (res.shortToken, res.longToken, userId)
          return service(error.config)
        })
      }
    }
    else if (status === 404) {
      ElMessage.error('网页不存在')
      return Promise.reject('网页不存在')
    }
    else {
      ElMessage.error(error.response.data.Msg)
    }
  }
)

export async function request<T>(config: InternalAxiosRequestConfig): Promise<AxiosResponse<myResponseType<T>, any>> {
  const response = await service.request<myResponseType<T>>(config)
  return response
}

export async function get<T = any>(url: string, params?: any): Promise<AxiosResponse<myResponseType<T>, any>> {
  const response = await service.get<myResponseType<T>>(url, params)
  return response
}

export async function post<T = any>(url: string, data?: any ): Promise<AxiosResponse<myResponseType<T>, any>> {
  const response = await service.post<myResponseType<T>>(url, data)
  return response
}

export async function put<T = any>(url: string, data?: any ): Promise<AxiosResponse<myResponseType<T>, any>> {
  const response = await service.put<myResponseType<T>>(url, data)
  return response
}