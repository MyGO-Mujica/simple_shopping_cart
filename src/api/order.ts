import request from './index'
import type { RawOrderWithDetail, CreateOrderParams, Order, OrderDetail, RawOrderDetail } from '../types'

// 转换订单详情项
const transformOrderDetail = (detail: RawOrderDetail): OrderDetail => {
  // 解析 nums 字段，格式为 "1, dealPrice=1300.0"
  let quantity = 1
  let price = 0
  
  if (detail.nums) {
    const numsStr = detail.nums.toString()
    // 提取数量（逗号前的数字）
    const quantityMatch = numsStr.match(/^(\d+)/)
    if (quantityMatch) {
      quantity = Number(quantityMatch[1]) || 1
    }
    
    // 提取价格（dealPrice= 后的数字）
    const priceMatch = numsStr.match(/dealPrice[=\s]*([0-9.]+)/)
    if (priceMatch) {
      price = Number(priceMatch[1]) || 0
    }
  }
  
  // 如果有单独的 dealPrice 字段，优先使用
  if (detail.dealPrice !== undefined) {
    price = Number(detail.dealPrice) || price
  }
  
  return {
    id: detail.OrderDetailid,
    goodsId: detail.goodsId,
    goodsName: detail.goodsName,
    quantity,
    price
  }
}

// 转换订单数据
const transformOrder = (order: RawOrderWithDetail): Order => {
  const details = (order.orderDetail || []).map(transformOrderDetail)
  const totalAmount = details.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalQuantity = details.reduce((sum, item) => sum + item.quantity, 0)
  
  // 格式化订单时间
  const formatOrderTime = (timeStr: string): string => {
    try {
      const date = new Date(timeStr)
      if (!isNaN(date.getTime())) {
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }
    } catch (e) {
      console.error('时间格式化失败:', e)
    }
    return timeStr
  }
  
  return {
    id: order.id,
    orderTime: formatOrderTime(order.orderTime),
    orderDetails: details,
    totalAmount,
    totalQuantity
  }
}

// 创建订单
export const createOrder = async (params: CreateOrderParams): Promise<Order[]> => {
  const data = await request.get<any, any>('/order/addCastOrder', {
    params: {
      userId: params.userId,
      cartList: params.cartList
    }
  })
  
  const parsedData = data
  if (!Array.isArray(parsedData)) {
    return []
  }
  
  return parsedData.map(transformOrder)
}

// 获取用户订单列表
export const getOrderList = async (userId: string): Promise<Order[]> => {
  const data = await request.get<any, any>('/order/listByUser', {
    params: { userId }
  })
  
  const parsedData = data
  if (!Array.isArray(parsedData)) {
    return []
  }
  
  return parsedData.map(transformOrder)
}
