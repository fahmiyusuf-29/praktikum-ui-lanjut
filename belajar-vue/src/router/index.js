import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/App.vue'
import DashboardLayout from '@/layouts/DasboardLayout.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/Home.vue'),
        meta: { breadcrumb: 'Home' },
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('../views/About.vue'),
        meta: { breadcrumb: 'About' },
      },
      {
        path: 'browse',
        name: 'browse',
        component: () => import('../views/Browse.vue'),
        meta: { breadcrumb: 'Browse' },
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
            path: 'events/:id/register',
            name: 'event-registration',
            component: () => import('../views/EventRegistration.vue'),
            meta: { breadcrumb: 'Event Registration' },
          },
          {
            path: 'events/:id/ticket',
            name: 'ticket-receipt',
            component: () => import('../components/Event/TicketReceipt.vue'),
            meta: { breadcrumb: 'Ticket Receipt' },
          },
          {
            path: 'category',
            name: 'category',
            component: () => import('../views/Category.vue'),
            meta: { breadcrumb: 'Category' },
          },
          {
            path: 'your-events',
            name: 'your-events',
            component: () => import('../views/YourEvent.vue'),
            meta: { breadcrumb: 'Your Events' },
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
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'dashboard-overview',
        component: () => import('../views/Dashboard.vue'),
      },
      {
        path: 'events',
        name: 'dashboard-events',
        component: () => import('../views/EventManagement.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
