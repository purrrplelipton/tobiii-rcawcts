<template>
	<div data-role="header">
		<button type="button" @click="go$back">
			<IconArrowNarrowLeft aria-hidden="true" />
			<span>Back</span>
		</button>
	</div>
	<Loader v-if="loading && !country && !errorMessage" />
	<template v-if="!loading && country && !errorMessage">
		<div class="country-deets">
			<div class="flag-div">
				<img
					loading="lazy"
					:src="country.flags.svg"
					:alt="country.flags.alt || `an image of ${country.name.common}'s flag'`"
				/>
			</div>
			<div class="deets">
				<h2 v-html="country.name.common" />
				<div>
					<div class="deet">
						<p>
							Native Name:
							<span>
								<template
									v-for="nativeName in Object.keys(country.name.nativeName)"
									:key="nativeName"
								>
									<span v-html="country.name.nativeName[nativeName].official" />
								</template>
							</span>
						</p>
						<p>Population: <span v-html="country.population" /></p>
						<p>Region: <span v-html="country.region" /></p>
						<p>Sub Region: <span v-html="country.subregion" /></p>
						<p>
							Capital:
							<span v-if="country.capital">
								<template v-for="capital in country.capital" :key="capital">
									<span v-html="capital" />
								</template>
							</span>
						</p>
					</div>
					<div class="deet">
						<p>
							Top Level Domain:
							<span>
								<template v-for="tld in country.tld" :key="tld">
									<span v-html="tld" />
								</template>
							</span>
						</p>
						<p>
							Currencies:
							<span>
								<template v-for="currency in Object.keys(country.currencies)" :key="currency">
									<span v-html="country.currencies[currency].name" />
								</template>
							</span>
						</p>
						<p>
							Languages:
							<span>
								<template v-for="language in Object.keys(country.languages)" :key="language">
									<span v-html="country.languages[language]" />
								</template>
							</span>
						</p>
					</div>
				</div>
				<div class="deet_">
					<h3>Border Countries:</h3>
					<div v-if="country.borders">
						<template v-for="border in country.borders" :key="border">
							<RouterLink :replace="true" :to="border">
								<span v-html="border" />
							</RouterLink>
						</template>
					</div>
				</div>
			</div>
		</div>
	</template>
	<Error v-if="!loading && errorMessage" :message="errorMessage" />
</template>

<script>
import { IconArrowNarrowLeft } from '@tabler/icons-vue';
import { RouterLink } from 'vue-router';
import Error from '@/components/common/Error.vue';
import Loader from '@/components/common/Loader.vue';

export default {
	name: 'DetailsVue',
	data() {
		return { loading: false, country: null, errorMessage: null };
	},
	computed: {
		cca3() {
			const { cca3 } = this.$route.params;
			if (cca3) return cca3;
			return '';
		}
	},
	methods: {
		go$back() {
			this.$router.back();
		},
		async fetch$data() {
			try {
				this.loading = true;

				await this.$nextTick();

				const response = await fetch(`https://restcountries.com/v3.1/alpha/${this.cca3}`);
				if (!response.ok) {
					throw new Error('Error fetching country details.');
				}
				const data = await response.json();
				this.country = data[0];
			} catch ({ message }) {
				this.errorMessage = message;
			} finally {
				this.loading = false;
			}
		}
	},
	components: { IconArrowNarrowLeft, RouterLink, Error, Loader },
	async mounted() {
		await this.fetch$data();
	},
	watch: {
		cca3: 'fetch$data'
	},
	beforeUnmount() {
		this.loading = false;
		this.country = null;
		this.errorMessage = null;
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

	:root[data-mode="dark"] [data-role="header"] > button:first-child {
		background-color: hsl(209, 23%, 22%);
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

	.country-deets {
		width: 100%;
		margin: 3.75em auto 2.5em;
		display: grid;
	}

	.flag-div {
		position: relative;
		padding-bottom: calc((2 / 3) * 100%);
		align-self: start;
		background-color: hsl(0, 0%, 0%, 0.025);
	}

	.flag-div img {
		display: block;
		position: absolute;
		inset: 0 auto auto 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.deets {
		display: grid;
		margin: 2.5em 0;
		align-self: start;
	}

	.deets h2 {
		font-size: 2em;
		font-weight: 800;
		margin: 0 0 0.5em;
	}

	.deets h2 + div {
		display: grid;
	}

	.deet {
		display: flex;
		flex-flow: column nowrap;
		align-items: stretch;
		gap: 0.125em;
	}

	.deet:last-of-type {
		margin: 2.5em 0;
	}

	.deet p span:has(> span) span:not(:first-child, :last-child):before {
		content: ",";
		display: inline-grid;
		place-items: center;
		width: 1em;
		height: 1em;
		margin-left: -0.375em;
	}

	.deet p span:has(> span) span:not(:only-child):last-child:before  {
		content: "&";
		display: inline-grid;
		place-items: center;
		width: 1em;
		height: 1em;
		margin: 0 0.125em;
	}

	.deet p span {
		font-weight: 300;
		overflow-wrap: break-word;
	}

	.deet_ h3 {
		font-size: 1.125em;
		margin-bottom: 0.75em;
	}

	.deet_ div {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.625em;
	}

	.deet_ div a {
		flex-shrink: 0;
		font-size: 0.9375em;
		font-weight: 300;
		line-height: 0.875em;
		padding: 0.5em 1.25em 0.375em;
		box-shadow: 0 0 8px -2px #0002;
		background-color: #fff;
	}
	
	:root[data-mode="dark"] .deet_ div a {
		background-color: hsl(209, 23%, 22%);
	}

	@media only screen and (min-width: 768px) {
		.country-deets {
			grid-template-columns: repeat(2, 1fr);
			gap: 2em;
		}

		.flag-div {
			grid-column: 1 / 2;
		}

		.deets {
			grid-template-columns: repeat(2, 1fr);
			grid-column: 2 / 3;
			margin: 0;
		}

		.deets h2,
		.deets h2 + div,
		.deet_ {
			grid-column: 1 / span 2;
		}
	}

	@media only screen and (min-width: 1024px) {
		.country-deets {
			gap: 3em;
		}

		.deets {
			align-self: center;
		}

		.deets h2 + div {
			grid-template-columns: repeat(2, 1fr);
		}

		.deet:last-of-type {
			margin: 0;
		}

		.deet_ {
			margin: 2.5em 0;
			display: flex;
			gap: 1em;
		}

		.deet_ h3 {
			margin-bottom: 0;
			flex-shrink: 0;
		}
	}

	@media only screen and (min-width: 1366px) {
		.country-deets {
			gap: 6em;
		}
	}
</style>
