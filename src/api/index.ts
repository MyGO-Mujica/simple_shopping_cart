import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  // 通过 Vite 代理转发到后端，避免浏览器直连跨域
  baseURL: '/api',
  timeout: 10000
})

// 登录接口不返回 token，这里不强制附带 Authorization
request.interceptors.request.use((config) => config, (error) => Promise.reject(error))

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data  // 自动提取 data，不用每次都写 .data
  },
  (error) => {
    if (error.response) {
       // 统一错误处理
      ElMessage.error(error.response.data?.message || '请求失败')
    } else {
      
    }
    return Promise.reject(error)
  }
)

export default request
