import { createRouter, createWebHistory} from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/login-register/login.vue'),
  }

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })
  
  export default router