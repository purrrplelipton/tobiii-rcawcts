<template>
	<div>
		<img :src="flag" :alt="`an image of ${name}'s flag'`" />
		<div>
			<h2 v-html="name" />
			<div>
				<p v-html="population" />
				<p v-html="region" />
				<p v-html="capital" />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'CountrySummary',
	props: {
		flag: String,
		name: String,
		population: Number,
		region: String,
		capital: String
	}
};
</script>

<style scoped></style>
