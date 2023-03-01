<template lang="pug">
	.video-player
		.info-layer
			.video-header
				|Recent video
			.video-title
				|{{ title }}
			.video-subtitle
				|{{date}}, {{description}}
		.video
			img(:src="src")

</template>

<script>
	export default {
		props: ["src", "title", "date", "description"]
	}	
</script>

<style lang="sass">
	.video-player
		position: relative
		overflow: hidden
		&.playing
			.info-layer
				transform: translateX(-100%)
				transition: .3s linear all
		.info-layer
			position: absolute
			background-color: rgba(0, 0, 0, 0.3)
			top: 0
			bottom: 0
			left: 0
			right: 0
			padding: 15px
			transition: .3s linear all
			.video-header
				margin-top: 30%
				margin-bottom: 15px
				font-size: 10pt
				color: white
				font-family: Raleway
				font-weight: 600
				letter-spacing: 1px
			.video-subtitle
				font-size: 12pt
				color: white
				font-family: Raleway
				font-weight: 500
			.video-title
				font-size: 14pt
				color: white
				font-family: Raleway
				font-weight: 800
		.video
			width: 100%
			height: 400px
			img
				width: 100%
				height: 100%
		&:hover
			.info-layer
				transform: translateX(-100%)
				transition: .3s linear all
</style>