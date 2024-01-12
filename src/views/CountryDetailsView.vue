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
		<div class="country-details">
			<div>
				<img
					loading="lazy"
					:src="country$details.flags.svg"
					:alt="country$details.flags.alt || `an image of ${country$details.name.common}'s flag'`"
				/>
			</div>
			<div>
				<h2 v-html="country$details.name.common" />
				<div>
					<p>
						Native Name:
						<span>
							<template
								v-for="nativeName in Object.keys(country$details.name.nativeName)"
								:key="nativeName"
							>
								<span v-html="country$details.name.nativeName[nativeName].official" />
							</template>
						</span>
					</p>
					<p>Population: <span v-html="country$details.population" /></p>
					<p>Region: <span v-html="country$details.region" /></p>
					<p>Sub Region: <span v-html="country$details.subregion" /></p>
					<p>
						Capital:
						<span>
							<template v-for="capital in country$details.capital" :key="capital">
								<span v-html="capital" />
							</template>
						</span>
					</p>
				</div>
			</div>
			<div>
				<p>
					Top Level Domain:
					<span>
						<template v-for="tld in country$details.tld" :key="tld">
							<span v-html="tld" />
						</template>
					</span>
				</p>
				<p>
					Currencies:
					<span>
						<template v-for="currency in Object.keys(country$details.currencies)" :key="currency">
							<span v-html="country$details.currencies[currency].name" />
						</template>
					</span>
				</p>
				<p>
					Languages:
					<span>
						<template v-for="language in Object.keys(country$details.languages)" :key="language">
							<span v-html="country$details.languages[language]" />
						</template>
					</span>
				</p>
			</div>
			<div>
				<h3>Border Countries:</h3>
				<div>
					<!-- <template v-for="" :key="">
						<span v-html="country" />
					</template> -->
				</div>
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
		z-index: 99;
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

	.country-details {
		width: 100%;
		margin: 3.75em auto 2.5em;
	}

	.country-details > div:first-child {
		position: relative;
		width: 100%;
		padding-bottom: calc((2 / 3) * 100%);
	}

	.country-details > div:first-child img {
		display: block;
		position: absolute;
		inset: 0 auto auto 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.country-details > div:first-child + div {
		margin: 2.5em 0;
	}

	.country-details > div:first-child + div h2 {
		font-size: 2em;
		font-weight: 800;
		margin: 0 0 0.5em;
	}

	.country-details > div:first-child + div h2 + div,
	.country-details > div:first-child + div + div {
		display: flex;
		flex-flow: column nowrap;
		align-items: stretch;
		gap: 0.125em;
	}

	.country-details > div:first-child + div h2 + div p > span:has(> span),
	.country-details > div:first-child + div + div p > span:has(> span) {
		display: inline-flex;
		align-items: center;
	}

	.country-details > div:first-child + div h2 + div p span,
	.country-details > div:first-child + div + div p > span {
		font-weight: 300;
	}

	.country-details > div:last-child {
		margin: 2.5em 0;
	}

	.country-details > div:last-child h3 {
		font-weight: 800;
		font-size: 1.5em;
	}
</style>
