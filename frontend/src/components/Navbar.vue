<template>
  <nav class="bg-indigo-600 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold tracking-wider">Leave Management System</router-link>
        </div>
        <div class="flex items-center space-x-4">
          <template v-if="isAuthenticated">
             <span class="text-sm border border-indigo-400 px-2 py-1 rounded">{{ role }}</span>
             <button @click="logout" class="bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium transition duration-150">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150">Login</router-link>
            <router-link to="/register" class="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition duration-150">Register</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isAuthenticated = computed(() => !!localStorage.getItem('token'))
const role = computed(() => localStorage.getItem('role'))

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('userId')
  router.push('/login')
}
</script>
