import { createRouter, createWebHistory } from 'vue-router'

/**
 * @description: This is the router file for the application
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/nav/BTMDashboard.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/auth/BTMAccount.vue')
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('@/views/nav/BTMTransaction.vue')
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('@/views/nav/BTMInventory.vue')
    }
  ]
})

export default router
