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
			<RouterView />
		</div>
	</div>
</template>

<script>
import { IconMoon, IconSun } from '@tabler/icons-vue';
import { RouterView } from 'vue-router';

export default {
	name: 'App',
	data() {
		return { mode: 'light' };
	},
	methods: {
		switch$theme() {
			this.mode = this.mode === 'light' ? 'dark' : 'light';
		}
	},
	created() {
		const { mode } = this.$route.query;
		this.mode = ['light', 'dark'].includes(mode) ? mode : 'light';
	},
	components: { RouterView, IconMoon, IconSun },
	watch: {
		mode(selectedMode) {
			const current$query = { ...this.$route.query };
			this.$router.replace({ query: { ...current$query, mode: selectedMode } });
			const { documentElement } = window.document;
			documentElement.setAttribute('data-mode', this.mode);
		}
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
	scroll-behavior: smooth;
	transition: color 0.1s linear, background-color 0.1s linear;
}

:root[data-mode="dark"] {
	color: #fff;
	background-color: hsl(207, 26%, 17%);
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
	position: relative;
}

@keyframes spin {
	from {
		transform: rotate(0turn);
	} to {
		transform: rotate(1turn);
	}
}

header {
  background-color: #fff;
  box-shadow: 0 2px 4px #0001;
	margin-bottom: 1.5em;
	position: sticky;
	z-index: 99;
	top: 0;
}

:root[data-mode="dark"] header {
	background-color: hsl(209, 23%, 22%);
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
	border-radius: 4px;
}

header > .responsive-wrapper button:last-child:focus {
	outline-color: currentColor;
}

header > .responsive-wrapper button:last-child svg {
	width: 1.25em;
	height: 1.25em;
}
</style>
