<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Employer Dashboard</h1>
      <p class="text-gray-600 mt-2">Manage all employee leave requests</p>
    </div>

    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">Loading requests...</p>
    </div>
    
    <div v-else-if="leaves.length === 0" class="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 border border-gray-200">
      There are no leave requests from employees.
    </div>

    <div v-else class="grid gap-6">
      <div v-for="leave in leaves" :key="leave._id" class="bg-white rounded-lg shadow-md overlow-hidden border border-gray-200 hover:shadow-lg transition duration-200">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ leave.employeeId?.name || 'Unknown Employee' }}</h3>
              <p class="text-sm text-gray-500">{{ leave.employeeId?.email || '' }}</p>
            </div>
            <span :class="statusClass(leave.status)" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full uppercase tracking-wide">
              {{ leave.status }}
            </span>
          </div>
          
          <div class="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Leave Type</p>
              <p class="font-medium text-gray-800">{{ leave.leaveType }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Duration</p>
              <p class="font-medium text-gray-800">{{ formatDate(leave.startDate) }} to {{ formatDate(leave.endDate) }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-gray-500">Reason</p>
              <p class="text-gray-800 mt-1 p-3 bg-gray-50 rounded italic">{{ leave.reason }}</p>
            </div>
          </div>
        </div>
        
        <div v-if="leave.status === 'Pending'" class="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button @click="updateStatus(leave._id, 'Rejected')" class="bg-white border border-red-300 text-red-700 hover:bg-red-50 font-medium py-2 px-4 rounded shadow-sm transition duration-150">
            Reject
          </button>
          <button @click="updateStatus(leave._id, 'Approved')" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded shadow-sm transition duration-150">
            Approve
          </button>
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

const updateStatus = async (id, newStatus) => {
  try {
    await api.put(`/leaves/${id}/status`, { status: newStatus })
    fetchLeaves() // Refresh the list
  } catch (error) {
    console.error('Error updating status', error)
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
