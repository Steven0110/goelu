<template lang="pug">
	transition(name="fade-transition")
		.loader(:style="loaderCss()")
			.outter
				img(:src="image")

</template>

<script>
	export default {
		props: ["image", "background", "position"],
		methods: {
			loaderCss: function(){
				let css = {}
				
				css["background-color"] = this.background || "transparent"
				css.position = this.position || "fixed"

				return css
			}
		}
	}
</script>

<style lang="sass">
	.loader
		left: 0
		top: 0
		width: 100%
		height: 100%
		z-index: 999
		.outter
			position: relative
			width: 100%
			height: 100%

			img
				position: absolute
				left: 0
				right: 0
				top: 0
				bottom: 0
				margin: auto
				max-width: 100%
				max-height: 100%

	@media only screen and (min-width: 1367px)
		.loader
	@media only screen and (max-width: 1366px)
		.loader
	@media only screen and (max-width: 1024px)
		.loader
	@media only screen and (max-width: 768px)
		.loader
	@media only screen and (max-width: 640px)
		.loader
</style>