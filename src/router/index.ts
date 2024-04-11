import { createRouter, createWebHistory} from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/home/home.vue'),
  },
  {
    path: '/login/:code?',
    component: () => import('../views/login/login.vue'),
  },
  {
    path: '/forget',
    component: () => import('../views/login/forget.vue'),
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
    path: '/personal/:fatherId?',
    component: () => import('../views/personal/personal.vue'),
    name: 'personal'
  },
  {
    path: '/user',
    component: () => import('../views/information/user.vue'),
  },
  {
    path: '/user/center/:userId/:selectFirst/:selectSecond',
    component: () => import('../views/information/center.vue'),
  },
  {
    path: '/notification',
    component: () => import('../views/notification/notification.vue'),
  },
  {
    path: '/manage',
    component: () => import('../views/manage/manage.vue'),
  },
  {
    path: '/manage/post',
    component: () => import('../views/manage/post.vue'),
  },
  {
    path: '/posts/:select',
    component: () => import('../views/posts/posts.vue'),
  }, 
  {
    path: '/editor',
    component: () => import('../views/posts/text-editor.vue'),
  },
  {
    path: '/write',
    component: () => import('../views/posts/write.vue'),
  },
  {
    path: '/edit',
    component: () => import('../views/posts/write.vue'),
  },
  {
    path: '/post/:postId',
    component: () => import('../views/posts/post.vue'),
  },
  {
    path: '/search/:keyword/:type/:sort/:period',
    component: () => import('../views/search/search.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
  
export default router