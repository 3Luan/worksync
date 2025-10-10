<template>
  <div class="relative" ref="menuRef">
    <!-- Avatar Button -->
    <button
      @click="toggleMenu"
      class="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-muted/70 focus:outline-none"
    >
      <UserIcon class="w-5 h-5 text-muted-foreground" />
    </button>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-neutral-900 shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
      >
        <div class="p-3 border-b border-gray-100 dark:border-gray-800">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
              <UserIcon class="w-4 h-4" />
            </div>
            <div>
              <p class="text-sm font-medium text-foreground">
                {{ user?.name }}
              </p>
              <p class="text-xs text-muted-foreground">{{ user?.email }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col py-2">
          <button
            @click="goToProfile"
            class="flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-muted/60 transition"
          >
            <UserIcon class="w-4 h-4" /> {{ $t('common.profile') }}
          </button>
          <button
            @click="goToSettings"
            class="flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-muted/60 transition"
          >
            <Settings class="w-4 h-4" /> {{ $t('common.settings') }}
          </button>
        </div>

        <div class="border-t border-gray-100 dark:border-gray-800">
          <button
            @click="logout"
            class="flex items-center gap-2 px-4 py-2 text-sm text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 w-full"
          >
            <LogOut class="w-4 h-4" /> {{ $t('common.logout') }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { User as UserIcon, Settings, LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types/model'

const { t: $t } = useI18n()
const router = useRouter()
const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const auth = useAuthStore()
const user = ref<User | null>(auth.user);

const toggleMenu = () => (isOpen.value = !isOpen.value)
const closeMenu = (e: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

const goToProfile = () => {
  router.push({ name: 'admin.profile.index' })
  isOpen.value = false
}

const goToSettings = () => {
  router.push({ name: 'admin.settings.index' })
  isOpen.value = false
}

const logout = () => {
  auth.handleLogout();
  isOpen.value = false
}

onMounted(() => document.addEventListener('click', closeMenu))
onBeforeUnmount(() => document.removeEventListener('click', closeMenu))
</script>
