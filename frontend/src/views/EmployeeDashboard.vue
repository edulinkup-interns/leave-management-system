<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">My Leave Requests</h1>
      <button @click="showModal = true" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-150">
        Apply for Leave
      </button>
    </div>

    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">Loading...</p>
    </div>
    
    <div v-else-if="leaves.length === 0" class="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
      You have not applied for any leave yet.
    </div>

    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="leave in leaves" :key="leave._id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ leave.leaveType }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(leave.startDate) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(leave.endDate) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="statusClass(leave.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ leave.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Apply Leave Modal -->
    <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="submitLeave">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">Apply for Leave</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Leave Type</label>
                  <select v-model="form.leaveType" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Annual Leave">Annual Leave</option>
                  </select>
                </div>
                <div class="flex space-x-4">
                  <div class="w-1/2">
                    <label class="block text-sm font-medium text-gray-700">Start Date</label>
                    <input v-model="form.startDate" type="date" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div class="w-1/2">
                    <label class="block text-sm font-medium text-gray-700">End Date</label>
                    <input v-model="form.endDate" type="date" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Reason</label>
                  <textarea v-model="form.reason" rows="3" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse">
              <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                Submit Request
              </button>
              <button type="button" @click="showModal = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
            <div v-if="errorMsg" class="px-4 pb-4 text-red-600 text-sm text-center">{{ errorMsg }}</div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const leaves = ref([])
const loading = ref(true)
const showModal = ref(false)
const errorMsg = ref('')
const form = ref({
  leaveType: 'Sick Leave',
  startDate: '',
  endDate: '',
  reason: ''
})

const fetchLeaves = async () => {
  try {
    const response = await api.get('/leaves')
    leaves.value = response.data
  } catch (error) {
    console.error('Error fetching leaves', error)
  } finally {
    loading.value = false
  }
}

const submitLeave = async () => {
  errorMsg.value = ''
  try {
    await api.post('/leaves', form.value)
    showModal.value = false
    form.value = { leaveType: 'Sick Leave', startDate: '', endDate: '', reason: '' }
    fetchLeaves()
  } catch (error) {
    console.error('Error submitting leave', error)
    errorMsg.value = error.response?.data?.message || 'Failed to submit leave request'
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const statusClass = (status) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-800'
    case 'Rejected': return 'bg-red-100 text-red-800'
    default: return 'bg-yellow-100 text-yellow-800'
  }
}

onMounted(() => {
  fetchLeaves()
})
</script>
