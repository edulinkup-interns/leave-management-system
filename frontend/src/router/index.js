import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  { 
    path: '/employee', 
    name: 'EmployeeDashboard', 
    component: () => import('../views/EmployeeDashboard.vue'),
    meta: { requiresAuth: true, role: 'Employee' }
  },
  { 
    path: '/employer', 
    name: 'EmployerDashboard', 
    component: () => import('../views/EmployerDashboard.vue'),
    meta: { requiresAuth: true, role: 'Employer' }
  },
  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.role && to.meta.role !== userRole) {
    next(userRole === 'Employer' ? '/employer' : '/employee')
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    next(userRole === 'Employer' ? '/employer' : '/employee')
  } else {
    next()
  }
})

export default router
