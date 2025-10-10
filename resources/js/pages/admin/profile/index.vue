<script setup lang="ts">
import { ref } from 'vue'
import { Briefcase, Building2, MapPin, Mail, Plus, Check, X, ClipboardList } from 'lucide-vue-next'

const profile = ref({
  name: 'Luân',
  avatar: 'https://i.pravatar.cc/150?img=64',
  email: 'nguyenthanhluan@example.com',
  jobTitle: '',
  department: '',
  organization: '',
  location: '',
  workedOn: [
    { title: 'Subtask 2.1', project: 'My Kanban Project', time: 'You created this today', icon: '🧩' },
    { title: 'Task 2', project: 'My Kanban Project', time: 'You created this today', icon: '📘' },
    { title: 'Task 1', project: 'My Kanban Project', time: 'You created this today', icon: '☑️' },
  ],
})

const editingField = ref<string | null>(null)
const originalValue = ref('')

// Khi click vào input
const startEdit = (key: string) => {
  if (editingField.value !== key) {
    editingField.value = key
    originalValue.value = (profile.value as any)[key]
  }
}

// Khi bấm nút X → huỷ
const cancelEdit = (key: string) => {
  ;(profile.value as any)[key] = originalValue.value
  editingField.value = null
}

// Khi bấm ✅ → lưu
const saveEdit = () => {
  editingField.value = null
}
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
            <img :src="profile.avatar" alt="Avatar" class="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <h1 class="pt-8 text-3xl font-semibold text-gray-900">{{ profile.name }}</h1>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6 px-6 pb-10">
      <!-- LEFT: About -->
      <div class="space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 class="font-semibold text-gray-900 mb-3">About</h2>

          <!-- Job Title -->
          <div class="mb-3">
            <label class="flex items-center text-sm text-gray-500 gap-2">
              <Briefcase class="w-4 h-4" /> Your job title
            </label>
            <div class="mt-1 relative">
              <input
                v-model="profile.jobTitle"
                @focus="startEdit('jobTitle')"
                :class="[
                  'w-full mt-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500',
                  editingField === 'jobTitle' ? 'border-blue-500' : 'border-gray-300',
                ]"
                placeholder="Your job title"
              />
              <div v-if="editingField === 'jobTitle'" class="absolute right-2 top-2 flex gap-2">
                <button @click="saveEdit" class="text-green-600 hover:text-green-800">
                  <Check class="w-4 h-4" />
                </button>
                <button @click="cancelEdit('jobTitle')" class="text-red-500 hover:text-red-700">
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Department -->
          <div class="mb-3">
            <label class="flex items-center text-sm text-gray-500 gap-2">
              <Building2 class="w-4 h-4" /> Your department
            </label>
            <div class="mt-1 relative">
              <input
                v-model="profile.department"
                @focus="startEdit('department')"
                :class="[
                  'w-full mt-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500',
                  editingField === 'department' ? 'border-blue-500' : 'border-gray-300',
                ]"
                placeholder="Your department"
              />
              <div v-if="editingField === 'department'" class="absolute right-2 top-2 flex gap-2">
                <button @click="saveEdit" class="text-green-600 hover:text-green-800">
                  <Check class="w-4 h-4" />
                </button>
                <button @click="cancelEdit('department')" class="text-red-500 hover:text-red-700">
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Organization -->
          <div class="mb-3">
            <label class="flex items-center text-sm text-gray-500 gap-2">
              <Building2 class="w-4 h-4" /> Your organization
            </label>
            <input
              v-model="profile.organization"
              @focus="startEdit('organization')"
              :class="[
                'w-full mt-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500',
                editingField === 'organization' ? 'border-blue-500' : 'border-gray-300',
              ]"
              placeholder="Your organization"
            />
            <div v-if="editingField === 'organization'" class="absolute right-2 top-2 flex gap-2"></div>
          </div>

          <!-- Location -->
          <div class="mb-3">
            <label class="flex items-center text-sm text-gray-500 gap-2">
              <MapPin class="w-4 h-4" /> Your location
            </label>
            <div class="mt-1 relative">
              <input
                v-model="profile.location"
                @focus="startEdit('location')"
                :class="[
                  'w-full mt-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500',
                  editingField === 'location' ? 'border-blue-500' : 'border-gray-300',
                ]"
                placeholder="Your location"
              />
              <div v-if="editingField === 'location'" class="absolute right-2 top-2 flex gap-2">
                <button @click="saveEdit" class="text-green-600 hover:text-green-800">
                  <Check class="w-4 h-4" />
                </button>
                <button @click="cancelEdit('location')" class="text-red-500 hover:text-red-700">
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="pt-3 border-t border-gray-200">
            <p class="text-sm font-medium text-gray-500 mb-1">Contact</p>
            <p class="flex items-center gap-2 text-gray-700 text-sm">
              <Mail class="w-4 h-4 text-gray-500" />
              {{ profile.email }}
            </p>
          </div>

          <!-- Teams -->
          <div class="pt-3 border-t border-gray-200">
            <p class="text-sm font-medium text-gray-500 mb-1">Teams</p>
            <button class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition">
              <Plus class="w-4 h-4" /> Create a team
            </button>
          </div>

          <p class="text-xs text-gray-400 mt-5">View privacy policy</p>
        </div>
      </div>

      <!-- RIGHT: Worked on -->
      <div class="md:col-span-2 space-y-6">
        <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold text-gray-900">Worked on</h2>
            <a href="#" class="text-blue-600 text-sm hover:underline">View all</a>
          </div>

          <div class="divide-y divide-gray-100">
            <div
              v-for="(task, index) in profile.workedOn"
              :key="index"
              class="py-3 flex items-start gap-3"
            >
              <span class="text-xl">{{ task.icon }}</span>
              <div>
                <p class="font-medium text-gray-800">{{ task.title }}</p>
                <p class="text-sm text-gray-500">
                  {{ task.project }} · <span>{{ task.time }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Places you work in -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center">
          <div class="flex flex-col items-center justify-center space-y-3">
            <ClipboardList class="w-12 h-12 text-gray-400" />
            <h3 class="font-semibold text-gray-700">We don’t have places to show here yet</h3>
            <p class="text-sm text-gray-500 max-w-md">
              There are no projects or spaces you’ve worked in across the last 90 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
