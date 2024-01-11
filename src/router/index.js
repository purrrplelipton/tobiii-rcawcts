import { CountryDetailsView, HomeView } from '@/views';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: '/', name: 'home', component: HomeView },
		{ path: '/:cca3', name: 'country-details', component: CountryDetailsView }
	]
});

export default router;
