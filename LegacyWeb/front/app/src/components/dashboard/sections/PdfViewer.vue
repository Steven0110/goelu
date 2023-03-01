<template lang="pug">
	.pdf-viewer
		iframe(:src="pdfURL")
</template>

<script>
	export default {
		props: ["url"],
		computed: {
			pdfURL: function(){
				let encodedURL = encodeURIComponent(this.$route.query.url || "https://localhost")
				let url = `https://docs.google.com/viewer?url=${encodedURL}&embedded=true`
				return url
			}
		},
		components: {
		}
	}
</script>

<style lang="sass">
	.pdf-viewer
		position: relative
		padding-bottom: 0px
		min-height: 100%
		background-color: rgba(0, 0, 0, 0.05)
		iframe
			position: absolute
			left: 0
			top: 0
			width: 100%
			height: calc(100% - 50px)
</style>