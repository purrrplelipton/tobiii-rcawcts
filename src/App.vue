<template>
	<header>
		<div class="responsive-wrapper">
			<h1>Where in the world?</h1>
			<button
				type="button"
				:aria-label="`switch to ${mode === 'light' ? 'dark' : 'light'} mode`"
				@click="switch$theme"
			>
				<template v-if="mode === 'light'">
					<IconMoon />
				</template>
				<template v-if="mode !== 'light'">
					<IconSun />
				</template>
				<span>{{ mode === 'light' ? 'Dark' : 'Light' }} Mode</span>
			</button>
		</div>
	</header>
	<div role="main">
		<div class="responsive-wrapper"></div>
	</div>
</template>

<script>
import { IconMoon, IconSun } from '@tabler/icons-vue';

export default {
	name: 'App',
	data() {
		return { mode: 'light' };
	},
	methods: {
		switch$theme() {
			if (this.mode === 'light') {
				this.mode = 'dark';
				return;
			}
			this.mode = 'light';
		}
	},
	components: { IconMoon, IconSun }
};
</script>

<style>
:root {
  color: hsl(200, 15%, 8%);
  background-color: hsl(0, 0%, 98%);
  font-family: "Nunito Sans", sans-serif;
  font-weight: 600;
  min-height: 100%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: transparent;
  outline-width: 0;
  outline-style: solid;
  outline-color: transparent;
  font: inherit;
  color: inherit;
  max-width: 100%;
}

#app {
  display: contents;
}

.responsive-wrapper {
  width: 90%;
  max-width: 1280px;
  margin: 0 auto;
}

header {
  background-color: #fff;
  box-shadow: 0 2px 4px #0001;
}

header > .responsive-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2em 0;
  position: sticky;
  top: 0;
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
</style>
