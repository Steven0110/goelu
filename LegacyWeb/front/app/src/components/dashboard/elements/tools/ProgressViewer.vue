<template lang="pug">
	.progress.viewer(v-show="progress != 0")
		v-progress-linear(
			color="blue lighten-3",
			:value="progress",
			height="30")
			strong
				|{{ progress }}%
</template>

<script>
	export default {
		props: ["progress"]
	}
</script>

<style lang="sass">
	.progress.viewer
		position: absolute
		bottom: 0
		left: 0
		right: 0
		height: 10px
</style>