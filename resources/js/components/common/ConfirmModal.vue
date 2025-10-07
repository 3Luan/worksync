<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type ButtonVariants } from '@/components/ui/button';
import { XCircle, AlertTriangle, CheckCircle, HelpCircle, RefreshCw } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { ActionType } from '@/enums';
import { ConfirmModalType, ConfirmModalProps } from '@/types/component';

const props = withDefaults(defineProps<ConfirmModalProps>(), {
  title: 'common.actions',
  description: 'common.confirmActionMessage',
  confirmText: 'common.confirm',
  cancelText: 'common.cancel',
  type: ActionType.DELETE,
  size: 'md',
});

const emit = defineEmits(['confirm', 'cancel']);

const isOpen = ref(false);

const handleConfirm = () => {
  emit('confirm');
  close();
};

const handleCancel = () => {
  emit('cancel');
  close();
};

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

defineExpose({
  open,
  close,
  isOpen,
});

const iconMap = {
  [ActionType.DELETE]: XCircle,
  [ActionType.UPDATE]: RefreshCw,
  [ActionType.RESTORED]: CheckCircle,
  [ActionType.WARNING]: AlertTriangle,
  [ActionType.INFO]: HelpCircle,
  [ActionType.APPROVED]: CheckCircle,
  [ActionType.REJECTED]: XCircle,
};

const TYPE_COLOR = {
  PRIMARY: {
    icon: 'text-primary',
    bg: 'bg-primary/10 dark:bg-primary/20',
    confirmBtn: 'default',
    animation: '',
    shadow: 'shadow-sm shadow-primary/20',
    gradient: 'bg-gradient-to-r from-transparent via-primary/50 to-transparent',
    customBtnClass: '',
  },
  RED: {
    icon: 'text-destructive',
    bg: 'bg-destructive/10 dark:bg-destructive/20',
    confirmBtn: 'destructive',
    animation: 'animate-pulse',
    shadow: 'shadow-sm shadow-destructive/20',
    gradient: 'bg-gradient-to-r from-transparent via-destructive/50 to-transparent',
    customBtnClass: '',
  },
  GREEN: {
    icon: 'text-green-500',
    bg: 'bg-green-500/10 dark:bg-green-500/20',
    confirmBtn: 'custom-green',
    animation: '',
    shadow: 'shadow-sm shadow-green-500/20',
    gradient: 'bg-gradient-to-r from-transparent via-green-500/50 to-transparent',
    customBtnClass: 'outline border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 dark:hover:bg-green-950/30',
  },
  YELLOW: {
    icon: 'text-yellow-500',
    bg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
    confirmBtn: 'custom-yellow',
    animation: '',
    shadow: 'shadow-sm shadow-yellow-500/20',
    gradient: 'bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent',
    customBtnClass: 'outline border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-600 dark:hover:bg-yellow-950/30',
  },
  BLUE: {
    icon: 'text-blue-500',
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    confirmBtn: 'custom-blue',
    animation: '',
    shadow: 'shadow-sm shadow-blue-500/20',
    gradient: 'bg-gradient-to-r from-transparent via-blue-500/50 to-transparent',
    customBtnClass: 'outline border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 dark:hover:bg-blue-950/30',
  },
};

// Type styling map
const TYPE_STYLES = {
  [ActionType.DELETE]: TYPE_COLOR.RED,
  [ActionType.UPDATE]: TYPE_COLOR.PRIMARY,
  [ActionType.RESTORED]: TYPE_COLOR.PRIMARY,
  [ActionType.WARNING]: TYPE_COLOR.YELLOW,
  [ActionType.INFO]: TYPE_COLOR.BLUE,
  [ActionType.APPROVED]: TYPE_COLOR.GREEN,
  [ActionType.REJECTED]: TYPE_COLOR.RED,
};

// Size classes mapping
const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-xl',
};

const typeClasses = computed(() => {
  return TYPE_STYLES[props.type as ConfirmModalType];
});

const isCustomButton = computed(() => {
  return ['custom-green', 'custom-yellow', 'custom-blue'].includes(typeClasses.value.confirmBtn);
});

const standardButtonVariant = computed(() => {
  if (isCustomButton.value) {
    return 'outline';
  }
  return typeClasses.value.confirmBtn as ButtonVariants['variant'];
});

const sizeClasses = computed(() => {
  return SIZE_CLASSES[props.size];
});
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent
      :class="['p-0 overflow-hidden rounded-xl border border-gray-200 w-[85%] sm:w-[500px]', sizeClasses, typeClasses.shadow, 'transition-all ease-in-out']"
    >
      <div class="flex flex-col">
        <div class="p-6 pb-4">
          <div class="flex items-center justify-start space-x-5">
            <div :class="['flex-shrink-0 rounded-full p-3', typeClasses.bg, typeClasses.animation, 'transform transition-all ease-in-out']">
              <component :is="iconMap[type]" :class="['size-6', typeClasses.icon]" />
            </div>
            <div class="flex pt-1">
              <DialogHeader>
                <DialogTitle class="text-base sm:text-xl font-semibold tracking-tight">
                  {{ $t(title) }}
                </DialogTitle>
              </DialogHeader>
            </div>
          </div>
          <DialogDescription class="text-sm mt-2 opacity-90">
            {{ $t(description) }}
          </DialogDescription>
        </div>
        <slot name="content" />
        <div :class="['h-px w-full', typeClasses.gradient]" />
        <DialogFooter class="bg-muted/40 backdrop-blur-[2px] p-5 flex justify-center space-x-3">
          <Button variant="outline" size="sm" @click="handleCancel" class="transition-all duration-200 hover:scale-105 active:scale-95 m-0">
            {{ $t(cancelText) }}
          </Button>
          <Button
            v-if="isCustomButton"
            :class="[typeClasses.customBtnClass, 'transition-all duration-200 hover:scale-105 active:scale-95']"
            variant="outline"
            size="sm"
            @click="handleConfirm"
          >
            {{ $t(confirmText) }}
          </Button>
          <Button v-else :variant="standardButtonVariant" size="sm" @click="handleConfirm" class="transition-all duration-200 hover:scale-105 active:scale-95">
            {{ $t(confirmText) }}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>
