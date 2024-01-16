<template>
	<div class="dropdown-container" ref="dropdown">
		<button class="options-trigger" type="button" @click="optionsVisible = !optionsVisible">
			<span v-html="selectedRegion || 'Filter by Region'" />
			<component :is="optionsVisible ? 'IconChevronUp' : 'IconChevronDown'" aria-hidden="true" />
		</button>
		<div aria-live="polite">
			<ul v-if="optionsVisible">
				<template v-for="{ id, region } in regions" :key="id">
					<li>
						<button type="button" @click="region_select(region)">
							<span v-html="region" />
						</button>
					</li>
				</template>
			</ul>
		</div>
	</div>
</template>

<script>
import { IconChevronUp, IconChevronDown } from '@tabler/icons-vue';

export default {
	name: 'RegionDropdown',
	data() {
		return { optionsVisible: false };
	},
	props: {
		regions: Array,
		selectedRegion: String,
		selectRegion: Function
	},
	components: {
		IconChevronDown,
		IconChevronUp
	},
	methods: {
		region_select(opt) {
			this.$props.selectRegion(opt);
			this.optionsVisible = false;
		},
		outside_clicked(evt) {
			const dropdown = this.$refs.dropdown;
			if (dropdown && !dropdown.contains(evt.target)) {
				this.optionsVisible = false;
			}
		}
	},
	mounted() {
		window.document.addEventListener('click', this.outside_clicked);
	},
	beforeUnmount() {
		window.document.removeEventListener('click', this.outside_clicked);
	},
	watch: {
		optionsVisible(optVisible) {
			const { documentElement: root } = window.document;
			root.style.pointerEvents = optVisible ? 'none' : 'auto';
		}
	}
};
</script>

<style scoped>
.dropdown-container {
	font-size: .875em;
	display: inline-block;
	width: 100%;
	max-width: 200px;
	position: relative;
	pointer-events: auto;
}

.options-trigger {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #fff;
	border-radius: 8px;
	padding: 1em;
	box-shadow: 0 1px 8px #0001;
}

:root[data-mode="dark"]  .options-trigger {
	background-color: hsl(209, 23%, 22%);
}

.options-trigger:focus {
	outline-color: currentColor;
}

.options-trigger svg {
	width: 1.25em;
	height: 1.25em;
	pointer-events: none;
}

.options-trigger + div:not(:empty) {
	position: absolute;
	z-index: 1;
	inset: calc(100% + 8px) 0 auto 0;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 4px 12px #0001;
	padding: 0.5em 0;
}

:root[data-mode="dark"] .options-trigger + div:not(:empty) {
	background-color: hsl(209, 23%, 22%);
}

ul {
	list-style-type: none;
	position: relative;
}

ul li {
	display: contents;
}

li button {
	display: block;
	width: 100%;
	padding: 0.5em 1.375em;
	text-align: unset;
}

li button:hover {
	background-color: hsla(0, 0%, 0%, 0.01);
}

:root[data-mode="dark"] li button:hover {
	background-color: hsla(0, 0%, 100%, 0.01);
}

li button:focus {
	outline-color: currentColor;
	border-radius: 6px;
}
</style>
