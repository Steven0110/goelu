<template lang="pug">
	.image-viewer
		img(:src="url")
</template>

<script>
	export default {
		computed: {
			url: function(){
				let encodedURL = (this.$route.query.url || "https://localhost")
				
				return encodedURL
			}
		}
	}
</script>

<style lang="sass">
	.image-viewer
		min-height: 100%
		background-color: rgba(0, 0, 0, 0.05)
		text-align: center
		padding: 25px
		padding-bottom: 70px
		img
			display: inline-block
			max-width: 100%
</style>