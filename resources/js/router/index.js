import { createRouter, createWebHistory } from 'vue-router';
import ContractArticles from '../components/ContractArticles.vue';

    const routes = [
        {
            path: "/",
            name: 'Home',
            component: ContractArticles
        },
    ];
    const router = createRouter({
        history: createWebHistory(),
        routes
    });

export default router;
