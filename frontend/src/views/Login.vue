<template>
  <div class="flex items-center justify-center h-full mt-10">
    <div class="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Welcome Back</h2>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email Address</label>
          <input v-model="email" type="email" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        
        <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>

        <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150">
           Sign in
        </button>
      </form>
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account? 
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">Sign up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })
    
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('role', response.data.role)
    localStorage.setItem('userId', response.data._id)
    
    window.location.href = response.data.role === 'Employer' ? '/employer' : '/employee'
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
  }
}
</script>
