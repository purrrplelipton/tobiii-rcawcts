<template>
	<RouterLink :to="cca3">
		<img loading="lazy" :src="flags.png" :alt="flags.alt || `an image of ${name.common}'s flag'`" />
		<div>
			<h2 v-html="name.common" />
			<div>
				<p>Population: <span v-html="population" /></p>
				<p>Region: <span v-html="region" /></p>
				<p>Capital: <span v-html="capital[0]" /></p>
			</div>
		</div>
	</RouterLink>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
	name: 'CountrySummary',
	props: {
		capital: Array,
		cca3: String,
		flags: { png: String, alt: String },
		name: { common: String },
		population: Number,
		region: String
	},
	components: { RouterLink }
};
</script>

<style scoped>
a {
		display: block;
		background-color: #fff;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 8px #0001;
		transition: outline-color 0.125s ease-in-out, transform 0.125s ease-in-out;
	}

	a:focus {
		outline-color: currentColor;
	}

	a:hover {
		transform: scale(1.025);
	}

	a img {
		display: block;
		width: 100%;
		height: auto;
	}

	a > div {
		padding: 1.625em 1.5em;
	}

	a > div h2 {
		font-size: 1.25em;
		font-weight: 800;
	}

	a > div h2 + div {
		padding: 1em 0;
		display: flex;
		gap: 0.125em;
		flex-flow: column nowrap;
		align-items: stretch;
	}

	a > div h2 + div p span {
		font-weight: 300;
	}
</style>
