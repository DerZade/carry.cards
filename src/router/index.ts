import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/cards',
    },
    {
      path: '/cards',
      name: 'cards',
      component: () => import('../views/Cards.vue'),
      meta: {
        title: 'cards',
        showSettings: true,
      },
    },
    {
      path: '/card/:id',
      name: 'card',
      component: () => import('../views/Card.vue'),
      props: true,
      meta: {
        backTo: 'cards',
      },
    },
    {
      path: '/new',
      name: 'new',
      component: () => import('../views/New.vue'),
      meta: {
        backTo: 'cards',
        title: 'add_card',
      },
    },
  ],
})

export default router
