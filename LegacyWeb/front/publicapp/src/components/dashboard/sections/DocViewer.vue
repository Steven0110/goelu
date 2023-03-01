<template lang="pug">
	.doc-viewer
		iframe(:src="docURL")
</template>

<script>
	export default {
		props: ["url"],
		computed: {
			docURL: function(){
				console.log(this.$route.query.url)
				let encodedURL = encodeURIComponent(this.$route.query.url || "https://localhost")
				let url = `https://docs.google.com/gview?url=${encodedURL}&embedded=true`
				return url
			}
		},
		components: {
		}
	}
</script>

<style lang="sass">
	.doc-viewer
		padding-bottom: 80px
		iframe
			width: 100%
			height: 800px
</style>