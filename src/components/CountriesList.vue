<template>
	<ul>
		<template v-for="{ cca3, flags, name, population, region, capital } in countries" :key="cca3">
			<li>
				<RouterLink :to="cca3">
					<div>
						<img
							loading="lazy"
							:src="flags.svg"
							:alt="flags.alt || `an image of ${name.common}'s flag'`"
						/>
					</div>
					<div>
						<h2 v-html="name.common" />
						<div>
							<p>Population: <span v-html="population" /></p>
							<p>Region: <span v-html="region" /></p>
							<p>
								Capital:
								<span>
									<template v-for="cptl in capital" :key="cptl">
										<span v-html="cptl" />
									</template>
								</span>
							</p>
						</div>
					</div>
				</RouterLink>
			</li>
		</template>
	</ul>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
	name: 'CountrySummary',
	props: { countries: Array },
	components: { RouterLink }
};
</script>

<style scoped>
ul {
		list-style-type: none;
		width: 87.5%;
		margin: 2em auto 4em;
		display: grid;
		gap: 2em;
	}

a {
		display: block;
		background-color: #fff;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 8px #0001;
		transition: outline-color 0.125s ease-in-out, transform 0.125s ease-in-out;
	}

	:root[data-mode="dark"] a {
		background-color: hsl(209, 23%, 22%);
	}

	a:focus {
		outline-color: currentColor;
	}

	a:hover {
		transform: scale(1.025);
	}

	a > div {
		width: 100%;
		position: relative;
		padding-bottom: calc((10 / 16) * 100%);
	}

	a > div img {
		display: block;
		position: absolute;
		inset: 0 auto auto 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	a > div + div {
		padding: 1.625em 1.5em;
	}

	a > div + div h2 {
		font-size: 1.25em;
		font-weight: 800;
	}

	a > div + div h2 + div {
		padding: 1em 0;
		display: flex;
		gap: 0.125em;
		flex-flow: column nowrap;
		align-items: stretch;
	}

	a > div + div h2 + div p span {
		font-weight: 300;
	}

	@media only screen  and (min-width: 625px) {
		ul {
			grid-template-columns: repeat(2, 1fr);
			gap: 2.5em;
		}
	}

	@media only screen  and (min-width: 1024px) {
		ul {
			grid-template-columns: repeat(3, 1fr);
			gap: 4em;
		}
	}

	@media only screen  and (min-width: 1366px) {
		ul {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
