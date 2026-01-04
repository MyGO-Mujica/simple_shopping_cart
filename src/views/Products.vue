<template>
  <div class="products-container">
    <h2>商品列表</h2>
    
    <!-- 搜索和筛选 -->
    <el-card class="search-card">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索商品名称"
        prefix-icon="Search"
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch"
        style="width: 300px; margin-right: 10px;"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </el-card>

    <!-- 商品列表 -->
        <el-row :gutter="20" v-loading="loading">
          <el-col :span="6" v-for="product in pagedProducts" :key="product.id">
            <el-card class="product-card" :body-style="{ padding: '0px' }">
              <img :src="product.image || defaultImage" class="product-image" />
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <div class="product-footer">
                  <span class="price">¥{{ product.price.toFixed(2) }}</span>
                  <el-button type="primary" size="small" @click="addToCart(product)">
                    加入购物车
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

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

    <!-- 空状态 -->
    <el-empty v-if="!loading && total === 0" description="暂无商品" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { Product } from '../types'
import { getGoodsList } from '../api/goods'
import { addToCart as addToCartApi } from '../api/cart'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'

const loading = ref(false)
const searchKeyword = ref('')
const allProducts = ref<Product[]>([])
const currentPage = ref(1)
const pageSize = ref(12)
const defaultImage = 'https://via.placeholder.com/300?text=No+Image'
const cartStore = useCartStore()
const userStore = useUserStore()

const filteredProducts = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return allProducts.value
  return allProducts.value.filter((item) => item.name.toLowerCase().includes(keyword))
})

const total = computed(() => filteredProducts.value.length)

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredProducts.value.slice(start, start + pageSize.value)
})

// 获取商品列表
const getProductList = async () => {
  loading.value = true
  try {
    allProducts.value = await getGoodsList()
  } catch (error: any) {
    ElMessage.error(error?.message || '获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索商品
const handleSearch = () => {
  currentPage.value = 1
}

// 分页
const handlePageChange = (page: number) => {
  currentPage.value = page
}

// 加入购物车（调用后端接口）
const addToCart = async (product: Product) => {
  // 检查用户是否登录
  if (!userStore.isLoggedIn || !userStore.userId) {
    ElMessage.warning('请先登录')
    return
  }

  try {
    // 调用后端接口添加到购物车
    const cartItems = await addToCartApi({
      userId: userStore.userId,
      goodsId: product.id,
      num: 1,
      price: product.price
    })
    
    // 更新本地购物车状态
    cartStore.setCartItems(cartItems)
    
    ElMessage.success(`${product.name} 已加入购物车`)
  } catch (error: any) {
    ElMessage.error(error?.message || '加入购物车失败')
  }
}

onMounted(() => {
  getProductList()
})
</script>

<style scoped>
.products-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.products-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.search-card {
  margin-bottom: 20px;
}

.product-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}



.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #ff4d4f;
  font-size: 20px;
  font-weight: bold;
}
</style>
