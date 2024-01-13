import App from '@/App.vue';
import { createApp } from 'vue';
import { CountryDetailsView, HomeView } from '@/views';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', name: 'home', component: HomeView },
		{ path: '/:cca3', name: 'country-details', component: CountryDetailsView }
	]
});

createApp(App).use(router).mount('#app');
