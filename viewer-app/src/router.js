import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('./pages/HomePage.vue'), meta: { title: 'Steps' } },
  { path: '/about', name: 'about', component: () => import('./pages/AboutPage.vue'), meta: { title: 'About' } },
  { path: '/view/:step', name: 'view-step', component: () => import('./pages/ViewStepPage.vue'), meta: { title: 'Step' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
