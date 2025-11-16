<script setup lang="ts">
import { ClipboardList } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStore';

const auth = useAuthStore();
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <!-- Cover Banner -->
    <div class="h-40 w-full bg-gray-100 rounded-xl relative overflow-hidden"></div>

    <!-- Header -->
    <div class="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between gap-6 px-6 -mt-12 mb-8">
      <div class="flex items-center gap-6">
        <div class="relative">
          <div class="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-md">
            <img src="https://i.pravatar.cc/150?img=2" alt="Avatar" class="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <h1 class="pt-8 text-3xl font-semibold text-gray-900">{{ auth.user?.name }}</h1>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6 px-6 pb-10">
      <!-- LEFT: About -->
      <div class="space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 class="font-semibold text-gray-900 mb-3">About</h2>
          <div class="h-22"></div>
        </div>
      </div>

      <!-- RIGHT: Worked on -->
      <div class="md:col-span-2 space-y-6">
        <!-- Places you work in -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center">
          <div class="flex flex-col items-center justify-center space-y-3">
            <ClipboardList class="w-12 h-12 text-gray-400" />
            <h3 class="font-semibold text-gray-700">We don’t have places to show here yet</h3>
            <p class="text-sm text-gray-500 max-w-md">There are no projects or spaces you’ve worked in across the last 90 days.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
