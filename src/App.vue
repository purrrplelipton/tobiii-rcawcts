<template>
	<header>
		<div class="responsive-wrapper">
			<h1>Where in the world?</h1>
			<button
				type="button"
				:aria-label="`switch to ${mode === 'light' ? 'dark' : 'light'} mode`"
				@click="switch$theme"
			>
				<component :is="mode === 'light' ? 'IconMoon' : 'IconSun'" />
				<span v-html="`${mode === 'light' ? 'dark' : 'light'} mode`" />
			</button>
		</div>
	</header>
	<div role="main">
		<div class="responsive-wrapper">
			<component :is="current$view" />
		</div>
	</div>
</template>

<script>
import { IconMoon, IconSun } from '@tabler/icons-vue';
import Home from './pages/Home.vue';
import CountryDetails from './pages/CountryDetails.vue';
import NotFound from './pages/NotFound.vue';

const routes = { '/': Home, '/:id': CountryDetails };

export default {
	name: 'App',
	data() {
		return { path: window.location.hash, mode: 'light' };
	},
	computed: {
		current$view() {
			return routes[this.path.slice(1) || '/'] || NotFound;
		}
	},
	methods: {
		switch$theme() {
			this.mode = this.mode === 'light' ? 'dark' : 'light';
		}
	},
	components: { Home, IconMoon, IconSun },
	mounted() {
		window.addEventListener('hashchange', () => {
			this.path = window.location.hash;
		});
	}
};
</script>

<style>
:root {
  color: hsl(200, 15%, 8%);
  background-color: hsl(0, 0%, 98%);
  font-family: "Nunito Sans", sans-serif;
  font-weight: 600;
	line-height: 1.5;
  min-height: 100%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: transparent;
  outline-width: 2px;
  outline-offset: 2px;
  outline-style: solid;
  outline-color: transparent;
  font: inherit;
  color: inherit;
  max-width: 100%;
	background-color: transparent;
	text-decoration: none;
}

#app {
  display: contents;
}

.responsive-wrapper {
  width: 90%;
  max-width: 1280px;
  margin: 0 auto;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}

.not-sr-only {
	position: static;
	width: auto;
	height: auto;
	padding: 0;
	margin: 0;
	overflow: visible;
	clip: auto;
	white-space: normal;
}

header {
  background-color: #fff;
  box-shadow: 0 2px 4px #0001;
	margin-bottom: 1.5em;
	position: sticky;
	z-index: 99;
	top: 0;
}

header > .responsive-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2em 0;
}

header > .responsive-wrapper h1 {
  font-weight: 800;
}

header > .responsive-wrapper button:last-child {
	display: flex;
  align-items: center;
  gap: 0.375em;
  background-color: transparent;
}

header > .responsive-wrapper button:last-child svg {
	width: 1.25em;
	height: 1.25em;
}
</style>
