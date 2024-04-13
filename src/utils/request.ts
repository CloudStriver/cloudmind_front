import type {AxiosResponse, InternalAxiosRequestConfig} from 'axios'
import axios, {AxiosError} from 'axios'
import {useStore} from '@/store/index'
import {ElLoading, ElMessage} from 'element-plus'
import {errorMsg} from './message'
import {RefreshTokenUrl, StorageAutoLogin, StorageLongToken, StorageShortToken, StorageUserId} from "@/utils/consts";

interface myResponseType<T> extends AxiosResponse {
    code: number,
    msg: string,
    data: T
}
let loading: any
let loadingCount = 0
const startLoading = () => {
  loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
const endLoading = () => {
  loading.close()
}

const service = axios.create({
  baseURL: 'https://apisix.cloudmind.top:30443',
  timeout: 10000,
  headers: {
    'X-Xh-Env': 'pro',
    'Content-Type': 'application/json'
  }
})

const store = useStore()
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (loadingCount === 0) {
      startLoading()
    }
    loadingCount ++
    if (localStorage.getItem(StorageLongToken) === null && sessionStorage.getItem(StorageLongToken) === null) {
      return config
    }
    else if (localStorage.getItem(StorageLongToken) === null && sessionStorage.getItem(StorageLongToken) !== null) {
      config.headers['Authorization'] = sessionStorage.getItem(StorageShortToken)
    }
    else {
      config.headers['Authorization'] = localStorage.getItem(StorageShortToken)
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: any) => {
    loadingCount --
    if (loadingCount === 0) {
      endLoading()
    }
    return response.data
  },
  (error: any) => {
    endLoading()
    const status = error.response.status
    if (status === 401) {
      if (localStorage.getItem(StorageAutoLogin) === "true") {//自动登录情况
        const longToken = localStorage.getItem(StorageLongToken)
        if (longToken) {
          try {
            post(true, '/auth/refreshToken', { longToken })
            .then((res: any) => {
              if (res !== undefined) {
                const userId = localStorage.getItem(StorageUserId) as string
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
      else if (sessionStorage.getItem(StorageAutoLogin) === "false") {
        const longToken = sessionStorage.getItem(StorageLongToken)
        post(true, RefreshTokenUrl, { longToken })
        .then((res: any) => {
          const userId = sessionStorage.getItem(StorageUserId) as string
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
  return await service.request<myResponseType<T>>(config)
}

export async function get<T = any>(auth: boolean, url: string, params?: any): Promise<AxiosResponse<myResponseType<T>, any>> {
  if (auth) {
    const longToken = store.getUserLongToken()
    if (!longToken) {
      errorMsg('请先登录')
      return Promise.reject('请先登录')
    }
  }
  return await service.get<myResponseType<T>>(url, params)
}

export async function post<T = any>(auth: boolean,url: string, data?: any): Promise<AxiosResponse<myResponseType<T>, any>> {
  if (auth) {
    const longToken = store.getUserLongToken()
    if (!longToken) {
      errorMsg('请先登录')
      return Promise.reject('请先登录')
    }
  }
  return await service.post<myResponseType<T>>(url, data)
}

export async function put<T = any>(auth: boolean, url: string, data?: any ): Promise<AxiosResponse<myResponseType<T>, any>> {
  if (auth) {
    const longToken = store.getUserLongToken()
    if (!longToken) {
      errorMsg('请先登录')
      return Promise.reject('请先登录')
    }
  }
  return await service.put<myResponseType<T>>(url, data)
}