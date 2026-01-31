import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition && from !== START_LOCATION) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
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
        showBack: true,
      },
    },
    {
      path: '/new',
      name: 'new',
      component: () => import('../views/New.vue'),
      meta: {
        showBack: true,
        title: 'add_card',
      },
    },
  ],
})

router.beforeResolve((to, from, next) => {
  if (!document.startViewTransition) {
    next()
    return
  }

  document.startViewTransition(() => next())
})

export default router
