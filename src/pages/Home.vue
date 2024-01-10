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
					<template v-for="{ id, region } in regions" :key="id">
						<button type="button" @click="select$region(region)">
							<span v-html="region" />
						</button>
					</template>
				</div>
			</div>
		</div>
		<div class="countries-list">
			<template v-for="{ id, flags, name, population, region, capital } in countries" :key="id">
				<Country
					:id="id"
					:flags="flags"
					:name="name"
					:population="population"
					:region="region"
					:capital="capital"
				/>
			</template>
		</div>
		<div role="footer">
			<button type="button" aria-label="go to previous page">
				<IconArrowLeft />
			</button>
			<button type="button" aria-label="go to next page">
				<IconArrowRight />
			</button>
		</div>
	</template>
	<template v-if="!loading && error">
		<div>
			<h2>{{ error.message }}</h2>
		</div>
	</template>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import {
	IconSearch,
	IconChevronDown,
	IconChevronUp,
	IconLoader2,
	IconArrowLeft,
	IconArrowRight
} from '@tabler/icons-vue';
import Country from '@/components/Country.vue';

export default {
	name: 'HomePage',
	data() {
		return {
			show$options: false,
			selected$region: null,
			loading: false,
			regions: null,
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
		}
	},
	computed: {},
	components: {
		searchIcon: IconSearch,
		chevronDown: IconChevronDown,
		chevronUp: IconChevronUp,
		IconArrowLeft,
		IconArrowRight,
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
			this.countries = await data
				.slice(0, this.itemsPerPage)
				.map((country) => ({ id: uuidv4(), ...country }));
			this.regions = Array.from(new Set(this.countries.map((country) => country.region)))
				.map((region) => ({ id: uuidv4(), region }))
				.sort((reg$x, reg$y) => reg$x.region.localeCompare(reg$y.region));
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

.countries-list {
	width: 87.5%;
	margin: 2em auto 6em;
}

[role="footer"] {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.125em;
	position: sticky;
	bottom: 0;
	background-color: #0000;
	background-image: linear-gradient(to bottom, #0000, #fff);
}
</style>
