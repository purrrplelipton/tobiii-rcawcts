<template>
	<template v-if="loading && !countries && !error">
		<div class="loader-div">
			<component :is="'loaderIcon'" />
		</div>
	</template>
	<template v-if="!loading && countries && !error">
		<div data-role="header">
			<div class="search-area">
				<div class="search-box">
					<IconSearch />
					<input
						type="text"
						placeholder="Search for a country..."
						:value="search$value"
						@input="searchbox$handler"
					/>
				</div>
				<div class="search-results" aria-live="polite">
					<component v-if="searching && !search$results && !search$error" :is="'loaderIcon'" />
					<div v-if="!searching && search$results && search$results.length && !search$error">
						<template v-for="{ cca3, name, flags } in search$results" :key="cca3">
							<RouterLink :to="cca3">
								<div>
									<div>
										<img
											loading="lazy"
											:src="flags.svg"
											:alt="flags.alt || `an image of the ${name.common}'s flag`"
										/>
									</div>
								</div>
								<span v-html="name.common" />
							</RouterLink>
						</template>
					</div>
					<p v-if="!searching && search$results && !search$results.length && !search$error">
						Couldn't find any result matching “{{ search$value }}”
					</p>
					<p v-if="!searching && !search$results && search$error" v-html="search$error.message" />
				</div>
			</div>
			<div class="dropdown-area" ref="regionDropdown">
				<button aria-haspopup="true" type="button" @click="show$options = !show$options">
					<span v-html="selected$region || 'Filter by Region'" />
					<component :is="show$options ? 'chevronUp' : 'chevronDown'" aria-hidden="true" />
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
			<template v-for="{ cca3, flags, name, population, region, capital } in countries" :key="cca3">
				<Country
					:cca3="cca3"
					:flags="flags"
					:name="name"
					:population="population"
					:region="region"
					:capital="capital"
				/>
			</template>
		</div>
		<div data-role="footer">
			<button
				:aria-disabled="current$page <= 1"
				type="button"
				aria-label="go to previous page"
				@click="previous$page"
			>
				<IconArrowLeft />
			</button>
			<button
				:aria-disabled="current$page >= total$pages"
				type="button"
				aria-label="go to next page"
				@click="next$page"
			>
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
import { RouterLink } from 'vue-router';

export default {
	name: 'HomeView',
	data() {
		return {
			search$value: '',
			searching: false,
			search$results: null,
			search$error: null,
			show$options: false,
			selected$region: null,
			loading: false,
			countries: null,
			error: null,
			itemsPerPage: 50,
			current$page: 1,
			total$pages: null,
			search$timeout: null
		};
	},
	methods: {
		async searchbox$handler(ev) {
			this.search$value = ev.target.value;

			if (this.search$timeout) {
				clearTimeout(this.search$timeout);
			}

			this.search$timeout = setTimeout(async () => {
				if (this.search$value.trim()) {
					try {
						this.searching = true;
						const response = await fetch(
							`https://restcountries.com/v3.1/name/${this.search$value}`
						);
						if (!response.ok) {
							if (response.status === 404) return (this.search$results = []);
							throw new Error('Error searching for country.');
						}
						const data = await response.json();
						this.search$results = data;
					} catch (error) {
						this.search$error = error;
					} finally {
						this.searching = false;
					}
				} else {
					this.search$results = null;
					this.search$error = null;
				}
			}, 500);
		},
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
		pick$countries(countries, start) {
			return countries
				.sort((x, y) => x.name.common.localeCompare(y.name.common))
				.slice(start, start + this.itemsPerPage);
		},
		update$url() {
			const current$query = { ...this.$route.query };
			this.$router.push({ query: { ...current$query, page: this.current$page } });
		},
		async previous$page() {
			if (this.current$page > 1) {
				try {
					this.countries = null;
					this.loading = true;
					const response = await fetch(this.uri);
					if (!response.ok) {
						throw new Error('Error loading previous page.');
					}
					const data = await response.json();
					this.countries = await this.pick$countries(
						data,
						(this.current$page - 2) * this.itemsPerPage
					);
					this.current$page--;
					this.update$url();
				} catch (error) {
					this.error = error;
				} finally {
					this.loading = false;
				}
			}
		},
		async next$page() {
			if (this.current$page < this.total$pages) {
				try {
					this.countries = null;
					this.loading = true;
					const response = await fetch(this.uri);
					if (!response.ok) {
						throw new Error('Error loading next page.');
					}
					const data = await response.json();
					this.countries = await this.pick$countries(data, this.current$page * this.itemsPerPage);
					this.current$page++;
					this.update$url();
				} catch (error) {
					this.error = error;
				} finally {
					this.loading = false;
				}
			}
		}
	},
	computed: {
		regions() {
			return Array.from(new Set(this.countries.map((country) => country.region)))
				.map((region) => ({ id: uuidv4(), region }))
				.sort((reg$x, reg$y) => reg$x.region.localeCompare(reg$y.region));
		},
		uri() {
			return `https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3`;
		}
	},
	created() {
		const current$page = parseInt(this.$route.query.page) || 1;
		this.current$page = current$page > 0 ? current$page : 1;
	},
	components: {
		IconSearch,
		chevronDown: IconChevronDown,
		chevronUp: IconChevronUp,
		IconArrowLeft,
		IconArrowRight,
		loaderIcon: IconLoader2,
		Country,
		RouterLink
	},
	async mounted() {
		try {
			this.loading = true;
			const res = await fetch(this.uri);
			if (!res.ok) {
				throw new Error('Error fetching countries.');
			}
			const data = await res.json();
			if (Array.isArray(data)) {
				this.total$pages = Math.ceil(data.length / this.itemsPerPage);
				this.countries = await this.pick$countries(
					data,
					(this.current$page - 1) * this.itemsPerPage
				);
				this.update$url();
			}
		} catch (error) {
			this.error = error;
		} finally {
			this.loading = false;
		}
		window.document.addEventListener('click', this.outside$clicked);
	},
	watch: {
		current$page(newPage) {
			const current$query = { ...this.$route.query };
			this.$router.replace({ query: { ...current$query, page: newPage } });
		}
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

.loader-div > svg,
.search-results > svg {
	animation: spin 1s linear infinite;
}

.search-area {
	position: relative;
}

.search-box {
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

:root[data-mode="dark"] .search-box {
	background-color: hsl(209, 23%, 22%);
}

.search-box:focus-within {
	outline-color: currentColor;
}

.search-results:not(:empty) {
	position: absolute;
	z-index: 99;
	inset: calc(100% + 8px) 0 auto 0;
	border-radius: 8px;
	background-color: #fff;
	box-shadow: 0 4px 8px #0001;
	padding: 14px 0;
}

.search-results > svg {
	display: block;
	margin: 2.5em auto;
}

.search-results > div {
	height: 100%;
	max-height: 320px;
	overflow-y: auto;
}

.search-results > div a {
	display: flex;
	align-items: center;
	gap: 1em;
	padding: 0.625em 1.125em;
}

.search-results > div a:hover {
	background-color: hsla(0, 0%, 0%, 0.01);
}

.search-results > div a:focus {
	border-radius: 6px;
	outline-color: currentColor;
	outline-offset: -2px;
}

.search-results > div a div {
	width: 96px;
}

.search-results > div a div div {
	position: relative;
	padding-bottom: calc((10 / 16) * 100%);
}

.search-results > div a img {
	position: absolute;
	inset: 0 auto auto 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: center;
}

.search-results > div a div + span,
.search-results > p  {
	font-size: 0.875em;
	font-weight: 300;
}

.search-results > p {
	text-align: center;
}

[data-role="header"] {
	position: sticky;
	z-index: 99;
	top: 112px;
}

.dropdown-area {
	font-size: .875em;
	display: inline-block;
	width: 100%;
	max-width: 200px;
	position: relative;
}

.dropdown-area > button {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #fff;
	border-radius: 8px;
	padding: 1em;
	box-shadow: 0 1px 8px #0001;
}

:root[data-mode="dark"]  .dropdown-area > button {
	background-color: hsl(209, 23%, 22%);
}

.dropdown-area > button:focus {
	outline-color: currentColor;
}

.dropdown-area > button svg {
	width: 1.25em;
	height: 1.25em;
	pointer-events: none;
}

.dropdown-area > div {
	position: absolute;
	z-index: 1;
	inset: calc(100% + 8px) 0 auto 0;
	background-color: #fff;
	border-radius: 8px;
	padding: 0.5em 0;
	box-shadow: 0 4px 12px #0001;
}

.dropdown-area > div button {
	display: block;
	width: 100%;
	padding: 0.5em 1.375em;
	text-align: unset;
}

.dropdown-area > div button:hover {
	background-color: hsla(0, 0%, 0%, 0.01);
}

.dropdown-area > div button:focus {
	outline-color: currentColor;
	border-radius: 6px;
}

.countries-list {
	width: 87.5%;
	margin: 2em auto 4em;
	display: grid;
	gap: 2em;
}

[data-role="footer"] {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.125em;
	position: fixed;
	inset: auto 0 0 0;
	background-color: #0000;
	background-image: linear-gradient(to bottom, #0000, #fff);
	padding: 8px 0;
}

:root[data-mode="dark"] [data-role="footer"] {
	background-image: linear-gradient(to bottom, #0000, hsl(209, 23%, 22%));
}

[data-role="footer"] button {
	display: grid;
	place-items: center;
	padding: 6px;
	border-radius: 8px;
}

[data-role="footer"] button:not([aria-disabled="true"]):hover {
	transform: scale(1.125);
}

[data-role="footer"] button:focus {
	outline-color: currentColor;
}

[data-role="footer"] button > svg {
	width: 1.25em;
	height: 1.25em;
}

@media only screen  and (min-width: 625px) {
	.countries-list {
		grid-template-columns: repeat(2, 1fr);
		gap: 2.5em;
	}
}

@media only screen  and (min-width: 768px) {
	[data-role="header"] {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.search-box {
		margin-bottom: 0;
	}
}

@media only screen  and (min-width: 1024px) {
	.countries-list {
		grid-template-columns: repeat(3, 1fr);
		gap: 4em;
	}
}

@media only screen  and (min-width: 1366px) {
	.countries-list {
		grid-template-columns: repeat(4, 1fr);
		gap: 4em;
	}
}
</style>
