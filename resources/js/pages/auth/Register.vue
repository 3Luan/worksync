<script setup lang="ts">
import { LOGO_GOOGLE } from '@/constants/imageConst';
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-vue-next';

const router = useRouter();
const name = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const auth = useAuthStore();

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Mật khẩu và xác nhận mật khẩu không khớp!');
    return;
  }

  try {
    loading.value = true;

    const payload = {
      name: name.value,
      username: username.value,
      email: email.value,
      password: password.value,
    };

    const response = await auth.handleRegister(payload);
    if (response) {
      router.push('/login');
    }
  } catch (e) {
    console.error('Register error:', e);
  } finally {
    loading.value = false;
  }
};

const handleGoogleRegister = () => {
  window.location.href = '/api/auth/google';
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};
</script>

<template>
  <div class="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md mx-auto">
    <User class="mx-auto mb-2 w-16 h-16 text-indigo-600" />
    <h1 class="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
      Đăng ký WorkSync
    </h1>

    <form @submit.prevent="handleRegister" class="space-y-5">
      <!-- Name input -->
      <div class="relative">
        <User
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
        />
        <input
          v-model="name"
          type="text"
          required
          placeholder="Họ và tên"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-900 dark:text-white"
        />
      </div>

      <!-- Username input -->
      <div class="relative">
        <User
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
        />
        <input
          v-model="username"
          type="text"
          required
          placeholder="Tên đăng nhập"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-900 dark:text-white"
        />
      </div>

      <!-- Email input -->
      <div class="relative">
        <Mail
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
        />
        <input
          v-model="email"
          type="email"
          required
          autocomplete="email"
          placeholder="Email"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-900 dark:text-white"
        />
      </div>

      <!-- Password input -->
      <div class="relative">
        <Lock
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
        />
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          required
          placeholder="Mật khẩu"
          class="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-900 dark:text-white"
        />
        <button
          type="button"
          @click="togglePasswordVisibility"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
        </button>
      </div>

      <!-- Confirm password input -->
      <div class="relative">
        <Lock
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
        />
        <input
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          required
          placeholder="Xác nhận mật khẩu"
          class="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-900 dark:text-white"
        />
        <button
          type="button"
          @click="toggleConfirmPasswordVisibility"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <component :is="showConfirmPassword ? EyeOff : Eye" class="w-5 h-5" />
        </button>
      </div>

      <div v-if="auth.error" class="text-red-500 text-sm">{{ auth.error }}</div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold transition-all disabled:opacity-60"
      >
        {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
      </button>
    </form>

    <div class="flex justify-center items-center mt-4 text-sm">
      <router-link
        to="/auth/login"
        class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
        >Đăng nhập</router-link
      >
    </div>

    <div class="mt-4">
      <div class="flex items-center mb-4">
        <hr class="flex-grow border-gray-300 dark:border-gray-700" />
        <span class="px-3 text-gray-500 dark:text-gray-400 text-sm">Hoặc</span>
        <hr class="flex-grow border-gray-300 dark:border-gray-700" />
      </div>

      <button
        @click="handleGoogleRegister"
        class="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
      >
        <img :src="LOGO_GOOGLE" alt="Google" class="w-5 h-5" />
        <span class="font-medium text-gray-700 dark:text-gray-200">Đăng ký với Google</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style>
