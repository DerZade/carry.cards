import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/cards',
            component: () => import('../views/Cards.vue'),
            meta: {
                title: 'cards',
                showSettings: true,
            },
        },
    ],
});

export default router;
