// 用户相关类型
export interface LoginParams {
  name: string
  password: string
}

export interface RegisterParams {
  name: string
  password: string
}

export interface UserInfo {
  userId: string
  username: string
  token: string
}

// 商品相关类型（后端字段）
export interface RawProduct {
  id: string
  name: string
  price1: string
  pthumbnail: string
}

// 前端使用的商品结构
export interface Product {
  id: string
  name: string
  price: number
  image?: string
}

// 购物车相关类型
export interface CartItem {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
  image?: string
}

// 后端购物车数据结构
export interface RawCartItem {
  cardid: string
  userId: string
  goodsId: string
  num: string
  price: string
  thumbnail: string
  name: string
}

// 添加购物车请求参数
export interface AddCartParams {
  userId: string
  goodsId: string
  num: number
  price: number
}

// 订单相关类型
// 后端订单详情项数据结构
export interface RawOrderDetail {
  OrderDetailid: string
  goodsId: string
  goodsName: string
  nums: string
  dealPrice: string
}

// 后端订单数据结构（带详情）
export interface RawOrderWithDetail {
  id: string
  orderTime: string
  orderDetail: RawOrderDetail[]
}

// 前端订单详情项结构
export interface OrderDetail {
  id: string
  goodsId: string
  goodsName: string
  quantity: number
  price: number
}

// 前端订单结构
export interface Order {
  id: string
  orderTime: string
  orderDetails: OrderDetail[]
  totalAmount: number
  totalQuantity: number
}

// 创建订单请求参数
export interface CreateOrderParams {
  userId: string
  cartList: string  // 购物车项ID列表，用逗号分隔
}
