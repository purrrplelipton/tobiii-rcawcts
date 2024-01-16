import App from '@/App.vue';
import Details from '@/views/Details.vue';
import Home from '@/views/Home.vue';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', name: 'home', component: Home },
		{ path: '/:cca3', name: 'country-details', component: Details }
	]
});

createApp(App).use(router).mount('#app');
