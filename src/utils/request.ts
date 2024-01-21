import axios, { AxiosError } from 'axios'
import { userStore } from '@/store/index'
import { ElMessage } from 'element-plus'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ref } from 'vue'

interface myResponseType<T> extends AxiosResponse {
    code: number,
    msg: string,
    data: T
}

const service = axios.create({
  baseURL: 'https://apisix.cloudmind.top',
  timeout: 10000,
  headers: {
    'X_XH_ENV': 'test',
    'Content-Type': 'application/json'
  }
})

const store = userStore()
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const localToken = localStorage.getItem('AccessToken')
    config.headers['Authorization'] = localToken
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

const reqCounts = ref(0)
service.interceptors.response.use(
  (response: any) => {
    return response.data
  },
  (error: any) => {
    const status = error.response.status
        
    if (status === 401) {
      const refreshToken = localStorage.getItem('RefreshToken')
      
      if (refreshToken) {
        post('/usercenter/v1/auth/RefreshToken', { refreshToken })
        .then((response: any) => {
          if (response.msg === 'token有误') {
            store.loginOut()
            ElMessage.error('登录过期，请重新登录')
          }
          else {
            if (reqCounts.value < 2) {
              reqCounts.value ++
              const res = response.data
              store.updateToken(res.accessToken, res.refreshToken, res.chatToken)
              return service(error.config)
            }
            else {
              store.loginOut()
              ElMessage.error('登录过期，请重新登录')
            }
          }
        })
        .catch((error: any) => {
          console.log(error);
        })
      }
      else {
        store.loginOut()
        ElMessage.error('请登录')
        return Promise.reject('请登录')
      }
    }
    else if (status === 404) {
      ElMessage.error('网页不存在')
      return Promise.reject('网页不存在')
    }
    else {
      ElMessage.error('服务器出错，请及时联系管理员')
    }
  }
)

export async function request<T>(config: InternalAxiosRequestConfig): Promise<AxiosResponse<myResponseType<T>, any>> {
  const response = await service.request<myResponseType<T>>(config)
  return response
}

export async function get<T = any>(url: string): Promise<AxiosResponse<myResponseType<T>, any>> {
  const response = await service.get<myResponseType<T>>(url)
  return response
}

export async function post<T = any>(url: string, data?: any ): Promise<AxiosResponse<myResponseType<T>, any>> {
  const response = await service.post<myResponseType<T>>(url, data)
  return response
}