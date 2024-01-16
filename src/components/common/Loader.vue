<template>
	<div class="spinner-container">
		<IconLoader2 aria-hidden="true" />
	</div>
</template>

<script>
import { IconLoader2 } from '@tabler/icons-vue';

export default {
	name: 'LoaderVue',
	components: { IconLoader2 }
};
</script>

<style scoped>
.spinner-container {
  border-radius: 8px;
  backdrop-filter: blur(2px);
  display: grid;
  place-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  min-height: 96px;
  z-index: 99;
  background-color: #0001;
}

:root[data-mode="dark"] .spinner-container {
  background-color: #fff1;
}

.spinner-container svg {
  animation: spin linear 875ms infinite;
}

@keyframes spin {
  from {
    transform: rotate(0turn);
  } to {
    transform: rotate(1turn);
  }
}
</style>
