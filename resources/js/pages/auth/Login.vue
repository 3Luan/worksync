<script setup lang="ts">
import { LOGO_GOOGLE } from '@/settings/image'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const auth = useAuthStore()

const handleLogin = async () => {
  try {
    loading.value = true

    const payload = {
      email: email.value,
      password: password.value,
    }

    const response = await auth.handleLogin(payload);
    if (response) {
      router.push('/')
    }


    console.log('s:', auth.error);

  } catch (e) {
    console.error('Login error:', e)
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = () => {
  router.push('/forgot-password')
}

const handleGoogleLogin = () => {
  window.location.href = '/api/auth/google'
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
      Đăng nhập WorkSync
    </h1>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <div>
        <label class="block text-gray-600 dark:text-gray-300 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          required
          autocomplete="email"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-900 dark:text-white"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label class="block text-gray-600 dark:text-gray-300 mb-1">Mật khẩu</label>
        <input
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-900 dark:text-white"
          placeholder="••••••••"
        />
      </div>

      <div v-if="auth.error" class="text-red-500 text-sm">{{ auth.error }}</div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold transition-all disabled:opacity-60"
      >
        {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
      </button>
    </form>

    <!-- Quên mật khẩu -->
    <div class="flex justify-between items-center mt-4 text-sm">
      <button
        @click="handleForgotPassword"
        class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
      >
        Quên mật khẩu?
      </button>

      <router-link
        to="/register"
        class="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
      >
        Đăng ký tài khoản
      </router-link>
    </div>

    <div class="mt-8">
      <div class="flex items-center mb-4">
        <hr class="flex-grow border-gray-300 dark:border-gray-700" />
        <span class="px-3 text-gray-500 dark:text-gray-400 text-sm">Hoặc</span>
        <hr class="flex-grow border-gray-300 dark:border-gray-700" />
      </div>

      <button
        @click="handleGoogleLogin"
        class="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
      >
        <img :src="LOGO_GOOGLE" alt="Google" class="w-5 h-5" />
        <span class="font-medium text-gray-700 dark:text-gray-200">Đăng nhập với Google</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style>
