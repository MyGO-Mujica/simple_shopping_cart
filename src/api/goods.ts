import request from './index'
import type { RawProduct, Product } from '../types'

// 获取商品列表
export const getGoodsList = async (): Promise<Product[]> => {
  // 指定返回类型为原始商品数组，避免 AxiosResponse 类型干扰
  const data = await request.get<RawProduct[], RawProduct[]>('/goods/list')
  return (data || []).map((item: RawProduct) => ({
    id: item.id,
    name: item.name,
    price: Number(item.price1) || 0,
    image: item.pthumbnail ? `/api/${item.pthumbnail}` : ''
  }))
}
