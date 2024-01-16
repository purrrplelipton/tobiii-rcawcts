<template>
	<Loader v-if="loading && !countries && !error" />
	<template v-if="!loading && countries && !error">
		<div data-role="header">
			<Search />
			<RegionDropdown
				:regions="regions"
				:selected-region="selectedRegion"
				:select-region="selectRegion"
			/>
		</div>
		<CountriesList :countries="countries" />
		<Pagination
			:total-pages="totalPages"
			:current-page="currentPage"
			@goBack="goBack"
			@goNext="goNext"
		/>
	</template>
	<Error v-if="!loading && error" :message="error.message" />
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import CountriesList from '@/components/CountriesList.vue';
import Loader from '@/components/common/Loader.vue';
import Error from '@/components/common/Error.vue';
import RegionDropdown from '@/components/RegionDropdown.vue';
import Pagination from '@/components/Pagination.vue';
import Search from '@/components/Search.vue';

export default {
	name: 'HomeView',
	data() {
		return {
			selectedRegion: null,
			loading: false,
			countries: null,
			error: null,
			itemsPerPage: 50,
			currentPage: 1,
			totalPages: null
		};
	},
	methods: {
		selectRegion(opt) {
			this.selectedRegion = opt;
		},
		pick$countries(countries, start) {
			return countries
				.sort((x, y) => x.name.common.localeCompare(y.name.common))
				.slice(start, start + this.itemsPerPage);
		},
		update$url() {
			const prvQuery = { ...this.$route.query };
			this.$router.push({ query: { ...prvQuery, page: this.currentPage } });
		},
		async goBack() {
			if (this.currentPage > 1) {
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
						(this.currentPage - 2) * this.itemsPerPage
					);
					this.currentPage--;
					this.update$url();
				} catch (error) {
					this.error = error;
				} finally {
					this.loading = false;
				}
			}
		},
		async goNext() {
			if (this.currentPage < this.totalPages) {
				try {
					this.countries = null;
					this.loading = true;
					const response = await fetch(this.uri);
					if (!response.ok) {
						throw new Error('Error loading next page.');
					}
					const data = await response.json();
					this.countries = await this.pick$countries(data, this.currentPage * this.itemsPerPage);
					this.currentPage++;
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
	components: {
		Pagination,
		CountriesList,
		Loader,
		Error,
		RegionDropdown,
		Search
	},
	async mounted() {
		try {
			this.loading = true;
			const response = await fetch(this.uri);
			if (!response.ok) {
				throw new Error('Error fetching countries.');
			}
			const data = await response.json();
			this.totalPages = Math.ceil(data.length / this.itemsPerPage);
			this.countries = await this.pick$countries(data, (this.currentPage - 1) * this.itemsPerPage);
			this.update$url();
		} catch (error) {
			this.error = error;
		} finally {
			this.loading = false;
		}
	},
	watch: {
		currentPage(page) {
			const prvQuery = { ...this.$route.query };
			this.$router.replace({ query: { ...prvQuery, page } });
		}
	}
};
</script>

<style scoped>
[data-role="header"] {
	position: sticky;
	z-index: 99;
	top: 88px;
	padding: 1.5em 0;
}

@media only screen  and (min-width: 768px) {
	[data-role="header"] {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
}
</style>
