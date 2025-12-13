<template>
  <Popover v-model:open="isOpen" class="w-auto">
    <PopoverTrigger as="div">
      <Button
        variant="outline"
        :class="[
          props.class,
          'w-full justify-between text-left font-normal custom-focus-ring h-[36px]',
        ]"
        :disabled="props.disabled"
      >
        <input
          ref="inputRef"
          type="text"
          :value="inputValue"
          @keydown="onKeyDown"
          @input="onInput"
          @blur="onBlur"
          class="w-full text-sm rounded outline-none"
          :placeholder="DEFAULT_TIME_HHMM"
          maxlength="5"
        />
        <Clock class="h-5 w-5" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start" @open-auto-focus="(e) => e.preventDefault()">
      <div class="flex flex-row h-[300px] divide-y-0 divide-x">
        <div class="w-auto overflow-auto scroll-container" ref="hourContainer">
          <div class="flex flex-col p-2 w-max">
            <Button
              v-for="hour in hours"
              :key="hour"
              size="icon"
              :variant="date?.getHours() === hour ? 'default' : 'ghost'"
              class="sm:w-full shrink-0 aspect-square"
              @click="handleTimeChange(TimeUnit.HOUR, hour.toString())"
            >
              {{ formatString(hour) }}
            </Button>
          </div>
        </div>
        <div class="w-auto overflow-auto scroll-container" ref="minuteContainer">
          <div class="flex flex-col p-2 w-max">
            <Button
              v-for="minute in minutes"
              :key="minute"
              size="icon"
              :variant="date?.getMinutes() === minute ? 'default' : 'ghost'"
              class="sm:w-full shrink-0 aspect-square"
              @click="handleTimeChange(TimeUnit.MINUTE, minute.toString())"
            >
              {{ formatString(minute) }}
            </Button>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock } from 'lucide-vue-next';
import { DEFAULT_TIME_HHMM } from '@/constants';

const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
  class?: string | string[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// onstants
const PADDING_CONTAINER = 8; // px
const TOTAL_HOURS_IN_DAY = 24;
const TOTAL_MINUTES_IN_HOUR = 60;

// Enum for time units
enum TimeUnit {
  HOUR = 'hour',
  MINUTE = 'minute',
}

const date = ref<Date | null>(null);
const isOpen = ref(false);

const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref('');

const hours = computed(() => Array.from({ length: TOTAL_HOURS_IN_DAY }, (_, i) => i));
const minutes = computed(() => Array.from({ length: TOTAL_MINUTES_IN_HOUR }, (_, i) => i));
const hourContainer = ref<HTMLElement | null>(null);
const minuteContainer = ref<HTMLElement | null>(null);

// Format input value to type hour:minute
function formatString(value: string | number): string {
  return value ? value.toString().padStart(2, '0') : '00';
}

// handle input value to type hour:minute
const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

function isValidTimeFormat(value: string): boolean {
  return TIME_REGEX.test(value);
}

function formatTimeInput(value: string): string {
  const digits = value.replace(/[^\d:]/g, '').replace(/:/g, '');

  switch (digits.length) {
    case 0:
      return '';
    case 1:
    case 2:
      return digits;
    case 3:
      return `${digits.slice(0, 2)}:${digits.slice(2)}`;
    default:
      return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  }
}

function validateTimeValues(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':');
  return `${formatString(hours)}:${formatString(minutes)}`;
}

function onKeyDown(e: KeyboardEvent) {
  const allowedKeys = [
    'Backspace',
    'Tab',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ];

  const isCtrlCombo = e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase());
  const isNumberKey = /^[0-9]$/.test(e.key);

  if (!isNumberKey && !allowedKeys.includes(e.key) && !isCtrlCombo) {
    e.preventDefault();
  }
}

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const cursorPosition = target.selectionStart || 0;
  const oldValue = inputValue.value;
  const formatted = formatTimeInput(target.value);

  // Check if input value update
  if (formatted !== oldValue) {
    inputValue.value = formatted;

    // Update cursor position
    nextTick(() => {
      if (inputRef.value) {
        let newPosition = cursorPosition;

        // Move cursor to the next position after add ':'
        if (cursorPosition === 3) {
          newPosition = 4;
        }
        inputRef.value.setSelectionRange(newPosition, newPosition);
      }
    });
  }
}

function onBlur() {
  if (inputValue.value && isValidTimeFormat(inputValue.value)) {
    const validatedTime = validateTimeValues(inputValue.value);
    inputValue.value = validatedTime;
    emit('update:modelValue', validatedTime);
  } else {
    inputValue.value = '';
    emit('update:modelValue', '');
  }
}

function createDateFromTimeString(timeStr: string): Date | null {
  if (!timeStr || !isValidTimeFormat(timeStr)) return null;

  const [hours, minutes] = timeStr.split(':').map((n) => parseInt(n, 10));
  const newDate = new Date();
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  return newDate;
}

function formatTimeFromDate(date: Date): string {
  const hours = formatString(date.getHours());
  const minutes = formatString(date.getMinutes());
  return `${hours}:${minutes}`;
}

function handleTimeChange(type: TimeUnit, value: string) {
  const newDate = date.value ? new Date(date.value) : new Date();
  const parsedValue = parseInt(value, 10);

  type === TimeUnit.HOUR ? newDate.setHours(parsedValue) : newDate.setMinutes(parsedValue);
  date.value = newDate;
}

// handle click button to choose hour or minute
function scrollToSelectedTime() {
  if (!date.value) return;

  const selectedHour = date.value.getHours();
  const selectedMinute = date.value.getMinutes();

  if (hourContainer.value) {
    scrollToSelectedItem(hourContainer.value, selectedHour);
  }

  if (minuteContainer.value) {
    scrollToSelectedItem(minuteContainer.value, selectedMinute);
  }
}

function scrollToSelectedItem(container: HTMLElement, selectedIndex: number) {
  const buttons = container.querySelectorAll('button');
  const selectedButton = buttons[selectedIndex];

  if (selectedButton) {
    container.scrollTop = selectedButton.offsetTop - PADDING_CONTAINER;
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val && isValidTimeFormat(val)) {
      inputValue.value = val;
      date.value = createDateFromTimeString(val);
    } else {
      inputValue.value = val || '';
      date.value = null;
    }
  },
  { immediate: true },
);

watch(inputValue, (val) => {
  if (val && isValidTimeFormat(val)) {
    date.value = createDateFromTimeString(val);
  }
});

watch(date, (newDate) => {
  if (newDate) {
    const timeString = formatTimeFromDate(newDate);
    inputValue.value = timeString;
    emit('update:modelValue', timeString);
  }
});

watch(isOpen, async (open) => {
  if (props.disabled) {
    isOpen.value = false;
    return;
  }
  if (open && date.value) {
    await nextTick();
    scrollToSelectedTime();
  }
});
</script>

<style scoped>
.scroll-container {
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  max-height: 100%;
  position: relative;
}

.scroll-container::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
