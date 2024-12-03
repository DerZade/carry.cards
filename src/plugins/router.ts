import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
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
    ],
});

export default router;
