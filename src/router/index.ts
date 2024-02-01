import { createRouter, createWebHistory} from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/home/home.vue'),
  },
  {
    path: '/login',
    component: () => import('../views/login/login.vue'),
  },
  {
    path: '/register',
    component: () => import('../views/register/register.vue'),
  },
  {
    path: '/agreements_user',
    component: () => import('../views/agreements/user.vue'),
  },
  {
    path: '/agreements_privacy',
    component: () => import('../views/agreements/privacy.vue'),
  },
  {
    path: '/personal/:fatherId',
    component: () => import('../views/personal/personal.vue'),
    props: true,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/user',
    component: () => import('../views/information/user.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
  
export default router