<template>
  <div class="orders-container">
    <h2>我的订单</h2>

    <el-card v-loading="loading">
      <!-- 订单列表 -->
      <div class="order-list">
        <el-card
          v-for="order in orderList"
          :key="order.id"
          class="order-card"
          shadow="hover"
        >
          <div class="order-header">
            <span>订单号: {{ order.id }}</span>
            <span>下单时间: {{ order.orderTime }}</span>
          </div>

          <el-divider />

          <div class="order-items">
            <div v-for="item in order.orderDetails" :key="item.id" class="order-item">
              <div class="item-info">
                <h4>{{ item.goodsName }}</h4>
                <p>商品ID: {{ item.goodsId }}</p>
              </div>
              <div class="item-quantity">x {{ item.quantity }}</div>
              <div class="item-price">¥{{ item.price.toFixed(2) }}</div>
              <div class="item-subtotal">小计: ¥{{ (item.price * item.quantity).toFixed(2) }}</div>
            </div>
          </div>

          <el-divider />

          <div class="order-footer">
            <div class="order-total">
              <span>共 {{ order.totalQuantity }} 件商品</span>
              <span class="total-price">
                <span class="label">订单总额:</span>
                <span class="amount">¥{{ order.totalAmount.toFixed(2) }}</span>
              </span>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!loading && orderList.length === 0" description="暂无订单" />

      <!-- 分页 -->
      <el-pagination
        v-if="total > 0"
        background
        layout="prev, pager, next, total"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
        style="margin-top: 20px; text-align: center;"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOrderList as getOrderListApi } from '../api/order'
import { useUserStore } from '../stores/user'
import type { Order } from '../types'

const router = useRouter()
const loading = ref(false)
const orderList = ref<Order[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const userStore = useUserStore()

// 获取订单列表
const getOrderList = async () => {
  // 检查用户是否登录
  if (!userStore.isLoggedIn || !userStore.userId) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const data = await getOrderListApi(userStore.userId)
    orderList.value = data
    total.value = data.length
  } catch (error: any) {
    ElMessage.error(error?.message || '获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 分页
const handlePageChange = (page: number) => {
  currentPage.value = page
  // 前端分页处理
  const start = (page - 1) * pageSize.value
  const end = start + pageSize.value
  // 这里可以实现前端分页逻辑
}

onMounted(() => {
  getOrderList()
})
</script>

<style scoped>
.orders-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.orders-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  margin-bottom: 0;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
}

.item-info p {
  margin: 0;
  color: #999;
  font-size: 12px;
}

.item-quantity {
  color: #666;
  font-size: 14px;
  min-width: 50px;
  text-align: center;
}

.item-price {
  color: #7e7e80;
  font-weight: bold;
  font-size: 16px;
  min-width: 80px;
  text-align: right;
}

.item-subtotal {
  color: #2a2a2c;
  font-weight: bold;
  font-size: 14px;
  min-width: 120px;
  text-align: right;
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.order-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.total-price {
  font-size: 20px;
  font-weight: bold;
}

.total-price .label {
  color: #333;
}

.total-price .amount {
  color: #ff4d4f;
}

.order-actions {
  display: flex;
  gap: 10px;
}
</style>
