<template>
	<div data-role="header">
		<button type="button" @click="go$back">
			<IconArrowNarrowLeft aria-hidden="true" />
			<span>Back</span>
		</button>
	</div>
	<template v-if="loading && !country$details && !error">
		<div role="progressbar">
			<IconLoader2 aria-hidden="true" />
		</div>
	</template>
	<template v-if="!loading && country$details && !error">
		<img
			loading="lazy"
			:src="country$details.flags.png"
			:alt="country$details.flags.alt || `an image of ${country$details.name.common}'s flag'`"
		/>
		<div>
			<h2 v-html="country$details.name.common" />
			<div>
				<p>Native Name: <span v-html="country$details.name.common" /></p>
				<p>Population: <span v-html="country$details.population" /></p>
				<p>Region: <span v-html="country$details.region" /></p>
				<p>Sub Region: <span v-html="country$details.subregion" /></p>
				<p>Capital: <span v-html="country$details.capital[0]" /></p>
			</div>
		</div>
	</template>
	<template v-if="!loading && error">
		<div>
			<h2>{{ error.message }}</h2>
		</div>
	</template>
</template>

<script>
import { IconArrowNarrowLeft, IconLoader2 } from '@tabler/icons-vue';

export default {
	name: 'CountryDetailsView',
	data() {
		return { loading: false, country$details: null, error: null };
	},
	computed: {
		cca3() {
			const { cca3 } = this.$route.params;
			if (cca3) {
				return cca3;
			}
			return null;
		}
	},
	methods: {
		go$back() {
			this.$router.back();
		}
	},
	components: { IconArrowNarrowLeft, IconLoader2 },
	async mounted() {
		try {
			this.loading = true;
			const response = await fetch(`https://restcountries.com/v3.1/alpha/${this.cca3}`);
			if (!response.ok) {
				throw new Error('Error fetching country details.');
			}
			const data = await response.json();
			this.country$details = data[0];
		} catch (error) {
			this.error = error;
		} finally {
			this.loading = false;
		}
	},
	beforeUnmount() {
		this.loading = false;
		this.country$details = null;
		this.error = null;
	}
};
</script>

<style scoped>
[data-role="header"] {
		position: sticky;
		top: 112px;
	}

	[data-role="header"] > button:first-child {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25em;
		padding: 0.375em 1.25em;
		background-color: #fff;
		box-shadow: 0 0 8px #0001;
	}

	[data-role="header"] > button:first-child:hover {
		transform: scale(1.025);
	}

	[data-role="header"] > button:first-child:focus {
		outline-color: currentColor;
	}

	[role="progressbar"] {
		position: fixed;
		inset: 0;
		display: grid;
		place-items: center;
	}

	[role="progressbar"] > svg {
		animation: spin 1s linear infinite;
	}
</style>
