import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const username = ref<string>(localStorage.getItem('username') || '')
  const userId = ref<string>(localStorage.getItem('userId') || '')

  const isLoggedIn = computed(() => !!token.value)

  function setUserInfo(userToken: string, userName: string, id: string) {
    token.value = userToken
    username.value = userName
    userId.value = id
    localStorage.setItem('token', userToken)
    localStorage.setItem('username', userName)
    localStorage.setItem('userId', id)
  }

  function clearUserInfo() {
    token.value = ''
    username.value = ''
    userId.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
  }

  return {
    token,
    username,
    userId,
    isLoggedIn,
    setUserInfo,
    clearUserInfo
  }
})
