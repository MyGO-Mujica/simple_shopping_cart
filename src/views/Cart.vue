<template>
  <div class="cart-container">
    <h2>购物车</h2>

    <el-card v-loading="loading">
      <!-- 购物车列表 -->
      <el-table
        :data="cartList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品图片" width="120">
          <template #default="{ row }">
            <img :src="row.image || 'https://via.placeholder.com/80'" style="width: 80px; height: 80px; object-fit: cover;" />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="price" label="单价" width="120">
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="180">
          <template #default="{ row }">
            <el-input-number
              v-model="row.quantity"
              :min="1"   
            />
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120">
          <template #default="{ row }">
            <span class="subtotal">¥{{ (row.price * row.quantity).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="removeFromCart(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty v-if="!loading && cartList.length === 0" description="购物车是空的" />

      <!-- 结算栏 -->
      <div class="cart-footer" v-if="cartList.length > 0">
        <div class="total-info">
          <span>已选商品 {{ selectedItems.length }} 件</span>
          <span class="total-price">总计：¥{{ totalPrice }}</span>
        </div>
        <el-button
          type="primary"
          size="large"
          @click="handleCheckout"
          :disabled="selectedItems.length === 0"
        >
          结算
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCartList as getCartListApi, deleteCartItem } from '../api/cart'
import { createOrder } from '../api/order'
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'
import type { CartItem } from '../types'

const router = useRouter()
const loading = ref(false)
const cartList = ref<CartItem[]>([])
const selectedItems = ref<CartItem[]>([])
const userStore = useUserStore()
const cartStore = useCartStore()

// 计算总价
const totalPrice = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0).toFixed(2)
})

// 获取购物车列表
const getCartList = async () => {
  // 检查用户是否登录
  if (!userStore.isLoggedIn || !userStore.userId) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const data = await getCartListApi(userStore.userId)
    cartList.value = data
    // 同步更新 store 中的购物车数据
    cartStore.setCartItems(data)
  } catch (error: any) {
    ElMessage.error(error?.message || '获取购物车列表失败')
  } finally {
    loading.value = false
  }
}

// 选择改变
const handleSelectionChange = (selection: CartItem[]) => {
  selectedItems.value = selection
}



// 从购物车删除
const removeFromCart = async (item: CartItem) => {
  ElMessageBox.confirm('确定要从购物车中删除该商品吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 调用后端接口删除购物车商品
      const updatedCart = await deleteCartItem(userStore.userId, item.id)
      // 更新本地购物车列表
      cartList.value = updatedCart
      cartStore.setCartItems(updatedCart)
      // 清空选中项中已删除的商品
      selectedItems.value = selectedItems.value.filter(selected => selected.id !== item.id)
      ElMessage.success('已删除')
    } catch (error: any) {
      ElMessage.error(error?.message || '删除失败')
    }
  }).catch(() => {})
}

// 结算
const handleCheckout = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要结算的商品')
    return
  }
  
  ElMessageBox.confirm(`确定要提交 ${selectedItems.value.length} 件商品的订单吗?`, '确认订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(async () => {
    try {
      // 将选中的购物车项ID用逗号连接
      const cartIdList = selectedItems.value.map(item => item.id).join(',')
      
      // 调用后端接口创建订单
      await createOrder({
        userId: userStore.userId,
        cartList: cartIdList
      })
      
      ElMessage.success('订单创建成功')
      
      // 重新获取购物车列表（已结算的商品会被移除）
      await getCartList()
      
      // 清空选中项
      selectedItems.value = []
      
      // 跳转到订单页面
      router.push('/orders')
    } catch (error: any) {
      ElMessage.error(error?.message || '订单创建失败')
    }
  }).catch(() => {})
}

onMounted(() => {
  getCartList()
})
</script>

<style scoped>
.cart-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.cart-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.subtotal {
  color: #ff4d4f;
  font-weight: bold;
}

.cart-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-info {
  display: flex;
  gap: 30px;
  align-items: center;
}

.total-price {
  color: #ff4d4f;
  font-size: 24px;
  font-weight: bold;
}
</style>
