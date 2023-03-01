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
		position: relative
		padding-bottom: 0px
		background-color: rgba(0, 0, 0, 0.05)
		min-height: 100%
		iframe
			position: absolute
			left: 0
			top: 0
			width: 100%
			height: calc(100% - 50px)
</style>