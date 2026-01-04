import request from './index'
import type { LoginParams, RegisterParams } from '../types'

// 用户注册
export const register = (params: RegisterParams): Promise<string> => {
  return request.get('/user/register', { params })
}

// 用户登录
export const login = (params: LoginParams): Promise<string> => {
  return request.get('/user/login', { params })
}
