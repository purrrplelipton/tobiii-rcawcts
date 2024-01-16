<template>
	<p class="error-message">{{ message }}</p>
</template>

<script>
export default {
	name: 'ErrorVue',
	props: { message: String }
};
</script>

<style scoped>
.error-message {
    font-weight: 300;
    text-align: center;
  }
</style>
