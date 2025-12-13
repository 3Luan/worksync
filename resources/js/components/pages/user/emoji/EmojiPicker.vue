<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Smile } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'select', emoji: string): void;
}>();

const show = ref(false);

const emojis = [
  '😀',
  '😄',
  '😂',
  '🤣',
  '😊',
  '😍',
  '😘',
  '😎',
  '😭',
  '😡',
  '🤔',
  '👍',
  '👎',
  '🙏',
  '🔥',
  '❤️',
  '💯',
  '🎉',
  '✨',
  '🌟',
  '💫',
  '🎂',
  '🍕',
  '🍔',
  '🍟',
  '🌮',
  '🍣',
];

const onClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('[data-emoji-root]')) show.value = false;
};

onMounted(() => document.addEventListener('click', onClickOutside));
onUnmounted(() => document.removeEventListener('click', onClickOutside));
</script>

<template>
  <div data-emoji-root class="relative">
    <!-- Button 😊 -->
    <button
      type="button"
      @click="show = !show"
      class="p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
    >
      <Smile class="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </button>

    <!-- Picker -->
    <div
      v-if="show"
      class="absolute bottom-12 left-0 z-50 bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2 w-60"
    >
      <div class="grid grid-cols-8 gap-1 text-xl">
        <button
          v-for="emoji in emojis"
          :key="emoji"
          @click="
            emit('select', emoji);
            show = false;
          "
          class="hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          {{ emoji }}
        </button>
      </div>
    </div>
  </div>
</template>
