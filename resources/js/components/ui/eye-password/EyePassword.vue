<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next';

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();

const handleToggle = () => {
  emit('toggle');
};
</script>

<template>
  <button
    type="button"
    @click="handleToggle"
    class="absolute right-3 h-5 w-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
    aria-label="Hiện/ẩn mật khẩu"
  >
    <Eye v-if="!visible" />
    <EyeOff v-else />
  </button>
</template>
