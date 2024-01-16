<template>
	<div ref="searchbox" class="search-container">
		<label for="searchfield" class="field">
			<IconSearch />
			<input
				type="text"
				placeholder="Search for a country..."
				id="searchfield"
				:value="value"
				@input="search_handler"
			/>
		</label>
		<div aria-live="polite">
			<Loader v-if="searching && !results && !errorMessage" />
			<div v-if="!searching && results && results.length && !errorMessage" class="results-list">
				<ul>
					<template v-for="{ cca3, name, flags } in results" :key="cca3">
						<li>
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
						</li>
					</template>
				</ul>
			</div>
			<p v-if="!searching && results && !results.length && !errorMessage">
				Couldn't find any result matching “{{ value }}”
			</p>
			<Error v-if="!searching && !results && errorMessage" :message="errorMessage" />
		</div>
	</div>
</template>

<script>
import { IconSearch } from '@tabler/icons-vue';
import Error from './common/Error.vue';
import Loader from './common/Loader.vue';
import { RouterLink } from 'vue-router';

export default {
	name: 'SearchVue',
	data() {
		return { value: '', searching: false, results: null, errorMessage: null };
	},
	methods: {
		async search_handler({ target }) {
			this.value = target.value;

			if (this.timeout) {
				clearTimeout(this.timeout);
			}

			this.timeout = setTimeout(async () => {
				if (this.value.trim()) {
					this.results = null;
					try {
						this.searching = true;
						const response = await fetch(`https://restcountries.com/v3.1/name/${this.value}`);
						if (!response.ok) {
							if (response.status === 404) return (this.results = []);
							throw new Error('Error searching for country.');
						}
						const data = await response.json();
						this.results = data;
					} catch ({ message }) {
						this.errorMessage = message;
					} finally {
						this.searching = false;
					}
				} else {
					this.results = null;
					this.errorMessage = null;
				}
			}, 500);
		},
		outside_click({ target }) {
			const searchbox = this.$refs.searchbox;
			if (searchbox && !searchbox.contains(target)) {
				this.value = '';
				this.searching = false;
				this.results = null;
				this.errorMessage = null;
			}
		}
	},
	components: { IconSearch, Loader, RouterLink, Error },
	watch: {
		searching(srchng) {
			const { documentElement: root } = window.document;
			root.style.pointerEvents = srchng ? 'none' : 'auto';
		}
	},
	mounted() {
		window.document.addEventListener('click', this.outside_click);
	},
	beforeUnmount() {
		window.document.removeEventListener('click', this.outside_click);
	}
};
</script>

<style scoped>
.search-container {
	position: relative;
	margin-bottom: 3em;
	pointer-events: auto;
}

.field {
	display: flex;
	align-items: center;
	gap: 1.5rem;
	font-size: 0.875em;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 1px 8px #0001;
	padding: 0.875rem 2.125rem;
}

:root[data-mode="dark"] .field {
	background-color: hsl(209, 23%, 22%);
}

.field:focus-within {
	outline-color: currentColor;
}

.field + div:not(:empty) {
	position: absolute;
	z-index: 99;
	inset: calc(100% + 8px) 0 auto 0;
	border-radius: 8px;
	background-color: #fff;
	box-shadow: 0 4px 8px #0001;
	padding: 14px 0;
}

:root[data-mode="dark"] .field + div:not(:empty) {
	background-color: hsl(209, 23%, 22%);
}

.results-list {
	max-height: 320px;
	overflow-y: auto;
}

ul {
	position: relative;
	list-style-type: none;
}

ul li {
	display: contents;
}

ul li a {
	display: flex;
	align-items: center;
	gap: 1em;
	padding: 0.625em 1.125em;
}

ul li a:hover {
	background-color: hsla(0, 0%, 0%, 0.01);
}

:root[data-mode="dark"] ul li a:hover {
	background-color: hsla(0, 0%, 100%, 0.01);
}

ul li a:focus {
	border-radius: 6px;
	outline-color: currentColor;
	outline-offset: -2px;
}

ul li a div {
	width: 96px;
}

ul li a div div {
	position: relative;
	padding-bottom: calc((10 / 16) * 100%);
}

ul li a img {
	position: absolute;
	inset: 0 auto auto 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: center;
}

ul li a div + span,
.field + div > p  {
	font-size: 0.875em;
	font-weight: 300;
}

.field + div > p {
	text-align: center;
}

@media only screen  and (min-width: 768px) {
	.search-container {
		margin-bottom: 0;
	}
}
</style>
