<template>
	<template v-if="loading && !countries && !error">
		<div class="loader-div">
			<component :is="'loaderIcon'" />
		</div>
	</template>
	<template v-if="!loading && countries && !error">
		<div>
			<form>
				<component :is="'searchIcon'" />
				<input type="text" placeholder="Search for a country..." />
				<button type="submit" class="sr-only">search</button>
			</form>
			<div ref="regionDropdown">
				<button aria-haspopup="true" type="button" @click="show$options = !show$options">
					<span v-html="selected$region || 'Filter by Region'" />
					<component :is="show$options ? 'chevronUp' : 'chevronDown'" />
				</button>
				<div v-if="show$options">
					<template v-for="region in regions" :key="region">
						<button type="button" @click="select$region(region)">
							<span v-html="region" />
						</button>
					</template>
				</div>
			</div>
		</div>
		<div>
			<template v-for="country in countries">
				<!-- <Country :flag="country.flag" /> -->
			</template>
		</div>
	</template>
	<template v-if="!loading && error">
		<div>
			<h2>Error fetching data.</h2>
		</div>
	</template>
</template>

<script>
import { IconSearch, IconChevronDown, IconChevronUp, IconLoader2 } from '@tabler/icons-vue';
import Country from '@/components/Country.vue';

export default {
	name: 'HomePage',
	data() {
		return {
			show$options: false,
			selected$region: null,
			loading: false,
			countries: null,
			error: null,
			itemsPerPage: 20,
			currentPage: 1
		};
	},
	methods: {
		select$region(region) {
			this.selected$region = region;
			this.show$options = false;
		},
		outside$clicked(ev) {
			const region$dropdown = this.$refs.regionDropdown;
			if (region$dropdown && !region$dropdown.contains(ev.target)) {
				this.show$options = false;
			}
		},
		extract$regions() {
			if (this.countries) return [];
			return [...new Set(this.countries.map((country) => country.region))];
		}
	},
	computed: {
		regions() {
			return this.extract$regions();
		}
	},
	components: {
		searchIcon: IconSearch,
		chevronDown: IconChevronDown,
		chevronUp: IconChevronUp,
		loaderIcon: IconLoader2,
		Country
	},
	async mounted() {
		try {
			this.loading = true;
			const res = await fetch(
				`https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital`
			);
			if (!res.ok) {
				throw new Error('Error fetching countries.');
			}
			const data = await res.json();
			this.countries = data.slice(0, this.itemsPerPage);
		} catch (error) {
			this.error = error;
		} finally {
			this.loading = false;
		}
		window.document.addEventListener('click', this.outside$clicked);
	},
	beforeUnmount() {
		window.document.removeEventListener('click', this.outside$clicked);
	}
};
</script>

<style scoped>
.loader-div {
	position: fixed;
	inset: 0;
	display: grid;
	place-items: center;
}

@keyframes spin {
	from {
		transform: rotate(0turn);
	} to {
		transform: rotate(1turn);
	}
}

.loader-div > svg {
	animation: spin 1.125s linear infinite;
}

form {
	display: flex;
	align-items: center;
	gap: 1.5rem;
	font-size: 0.875em;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 1px 8px #0001;
	padding: 0.875rem 2.125rem;
	margin-bottom: 3em;
}

form + div {
	font-size: .875em;
	display: inline-block;
	width: 100%;
	max-width: 200px;
	position: relative;
}

form + div > button {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #fff;
	border-radius: 8px;
	padding: 1em;
	box-shadow: 0 1px 8px #0001;
}

form + div > button svg {
	width: 1.25em;
	height: 1.25em;
}

form + div > button + div {
	position: absolute;
	z-index: 1;
	inset: calc(100% + 0.375em) 0 auto 0;
	background-color: #fff;
	border-radius: 8px;
	padding: 0.5em 0;
	box-shadow: 0 4px 12px #0001;
}

form + div > button + div button {
	display: block;
	width: 100%;
	padding: 0.5em 1.375em;
	text-align: unset;
}
</style>
