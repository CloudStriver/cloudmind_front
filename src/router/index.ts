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
    path: '/user/center/:userId',
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
    path: '/test',
    component: () => import('../views/test-posts/posts.vue'),
  },
  {
    path: '/test/editor',
    component: () => import('../views/test-posts/text-editor.vue'),
  },
  {
    path: '/test/write',
    component: () => import('../views/test-posts/write.vue'),
  },
  {
    path: '/test/post/:postId',
    component: () => import('../views/test-posts/post.vue'),
  },
  {
    path: '/search',
    component: () => import('../views/search/search.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
  
export default router