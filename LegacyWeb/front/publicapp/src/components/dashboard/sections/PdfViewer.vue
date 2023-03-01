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
		padding-bottom: 40px
		iframe
			width: 100%
			height: 800px
</style>