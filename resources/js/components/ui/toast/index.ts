import { ref } from 'vue';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

// Create a reactive array to store toasts
const toasts = ref<Toast[]>([]);

export function useToast() {
  // Add a new toast
  function toast(options: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant || 'default',
      duration: options.duration || 5000,
    };

    toasts.value.push(newToast);

    // Auto remove toast after duration
    setTimeout(() => {
      dismiss(id);
    }, newToast.duration);

    return id;
  }

  // Remove a toast by id
  function dismiss(id: string) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  return {
    toasts,
    toast,
    dismiss,
  };
}
