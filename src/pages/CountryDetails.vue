<template>
	<div data-role="header">
		<button type="button">
			<IconArrowBack />
			<span>Back</span>
		</button>
	</div>
	<template v-if="loading && !details && !error">
		<div>
			<IconLoader2 />
		</div>
	</template>
	<template v-if="!loading && details && !error">
		<div>
			<IconLoader2 />
		</div>
	</template>
	<template v-if="!loading && error">
		<div>
			<h2>{{ error.message }}</h2>
		</div>
	</template>
</template>

<script>
import { IconArrowBack, IconLoader2 } from '@tabler/icons-vue';
export default {
	name: 'CountryDetailsPage',
	data() {
		return { loading: false, details: null, error: null };
	},
	components: { IconArrowBack, IconLoader2 },
	async mounted() {
		try {
			this.loading = true;
		} catch (error) {
			this.error = error;
		} finally {
			this.loading = false;
		}
	}
};
</script>

<style></style>
