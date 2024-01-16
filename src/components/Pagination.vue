<template>
	<div>
		<button
			:aria-disabled="currentPage <= 1"
			type="button"
			aria-label="go to previous page"
			@click="goBack"
		>
			<IconArrowLeft />
		</button>
		<button
			:aria-disabled="currentPage >= totalPages"
			type="button"
			aria-label="go to next page"
			@click="goNext"
		>
			<IconArrowRight />
		</button>
	</div>
</template>

<script>
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-vue';

export default {
	name: 'PaginationVue',
	components: { IconArrowLeft, IconArrowRight },
	props: { totalPages: Number, currentPage: Number, goBack: Function, goNext: Function }
};
</script>

<style scoped>
div {
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

:root[data-mode="dark"] div {
	background-image: linear-gradient(to bottom, #0000, hsl(209, 23%, 22%));
}

div button {
	display: grid;
	place-items: center;
	padding: 6px;
	border-radius: 8px;
}

div button:not([aria-disabled="true"]):hover {
	transform: scale(1.125);
}

div button:focus {
	outline-color: currentColor;
}

div button > svg {
	width: 1.25em;
	height: 1.25em;
}
</style>
