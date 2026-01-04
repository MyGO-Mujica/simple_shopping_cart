import request from './index'
import type { RawCartItem, AddCartParams, CartItem } from '../types'

// 将后端购物车数据转换为前端格式
const transformCartData = (data: RawCartItem[]): CartItem[] => {
  return (data || []).map((item: RawCartItem) => ({
    id: item.cardid,
    productId: item.goodsId,
    productName: item.name,
    price: Number(item.price) || 0,
    quantity: Number(item.num) || 0,
    image: item.thumbnail ? `/api/${item.thumbnail}` : ''
  }))
}

// 添加商品到购物车
export const addToCart = async (params: AddCartParams): Promise<CartItem[]> => {
  const data = await request.get<RawCartItem[], RawCartItem[]>('/cart/add', {
    params: {
      userId: params.userId,
      goodsId: params.goodsId,
      num: params.num,
      price: params.price
    }
  })
  
  return transformCartData(data)
}

// 获取购物车列表
export const getCartList = async (userId: string): Promise<CartItem[]> => {
  const data = await request.get<RawCartItem[], RawCartItem[]>('/cart/listByUser', {
    params: { userId }
  })
  
  return transformCartData(data)
}

// 删除购物车商品
export const deleteCartItem = async (userId: string, cartId: string): Promise<CartItem[]> => {
  const data = await request.get<RawCartItem[], RawCartItem[]>('/cart/deleteById', {
    params: {
      userId,
      cartId
    }
  })
  
  return transformCartData(data)
}
