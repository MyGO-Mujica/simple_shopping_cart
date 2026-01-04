import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
  image?: string
}

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>([])

  const cartCount = computed(() => cartItems.value.reduce((total, item) => total + item.quantity, 0))
  const cartTotal = computed(() => cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0))

  function addToCart(item: CartItem) {
    const existingItem = cartItems.value.find(i => i.productId === item.productId)
    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      cartItems.value.push(item)
    }
  }

  function removeFromCart(productId: string) {
    const index = cartItems.value.findIndex(i => i.productId === productId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }

  function clearCart() {
    cartItems.value = []
  }

  function setCartItems(items: CartItem[]) {
    cartItems.value = items
  }

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    clearCart,
    setCartItems
  }
})
