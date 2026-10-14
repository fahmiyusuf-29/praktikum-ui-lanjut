import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/App.vue'

const router = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/Home.vue'),
        meta: { breadcrumb: 'home' },
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('../views/About.vue'),
        meta: { breadcrumb: 'about' },
      },
      {
        path: 'browse',
        name: 'browse',
        component: () => import('../views/Browse.vue'),
        meta: { breadcrumb: 'browse' },
        redirect: '/browse/events',
        children: [
          {
            path: 'events',
            name: 'events',
            component: () => import('../views/EventList.vue'),
            meta: { breadcrumb: 'Events List' },
          },
          {
            path: 'events/:id',
            name: 'event-detail',
            component: () => import('../views/EventDetail.vue'),
            meta: { breadcrumb: 'Event Detail' },
          },
          {
            path: 'category',
            name: 'category',
            component: () => import('../views/Category.vue'),
            meta: { breadcrumb: 'Category' },
          },
        ],
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('../views/Contact.vue'),
        meta: { breadcrumb: 'Contact' },
      },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('../layouts/DasboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue'),
      },
    ],
  },
]

const routerInstance = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: router,
})

export default routerInstance
