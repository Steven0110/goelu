<template lang="pug">
	.video-player(:class="{playing: status.playing}")
		.info-layer
			.inner-container
				.video-header(v-show="!isDefault")
					|Recent video
				.video-title
					|{{ texts.title }}
				.video-subtitle(v-if="texts.date")
					|{{ texts.date | moment("MMMM Do, YYYY") }}, {{texts.description}}
				.video-subtitle(v-else)
					|{{texts.description}}
		.video
			video-player.video-player-box(
			ref="videoPlayer",
			:playsinline="true",
			:options="options",
			@play="status.playing = true",
			@pause="status.playing = false",
			@ended="status.playing = false")

</template>

<script>
	import { videoPlayer } from "vue-video-player"
	import "video.js/dist/video-js.css"

	export default {
		props: ["src", "title", "date", "description"],
		data() {
			return {
				status: {
					playing: false
				},
				texts: {
					title: "Welcome to goelU!",
					description: "Dashboard"
				},
				isDefault: true
			}
		},
		computed: {
			options: function(){
				let options = {
					muted: false,
					language: "en",
					playbackRates: [0.7, 1.0, 1.5, 2.0],
				}

				let encodedURL
				
				let files = this.$store.getters.files
				let videos = files.filter(file => file.type === "video")
				let lastVideo

				if(videos.length > 0){
					this.isDefault = false
					lastVideo = videos[ videos.length - 1 ]

					encodedURL = lastVideo.url
					this.texts.title = lastVideo.title
					this.texts.description = lastVideo.description
					this.texts.date = new Date(lastVideo.createdAt)

				}else
					encodedURL = "/assets/videos/Dashboard.mp4"

				options.sources = [ {type: "video/mp4",src: encodedURL} ]
				
				return options
			}
		},
		components: {
			"video-player": videoPlayer
		}
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
			z-index: 99
			.inner-container
				position: relative
				width: 100%
				height: 100%
				.video-header
					position: absolute
					bottom: 125px
					font-size: 10pt
					color: white
					font-family: Raleway
					font-weight: 600
					letter-spacing: 1px
				.video-subtitle
					position: absolute
					bottom: 75px
					font-size: 12pt
					color: white
					font-family: Raleway
					font-weight: 500
				.video-title
					position: absolute
					font-size: 14pt
					bottom: 45px
					color: white
					font-family: Raleway
					font-weight: 800
		.video
			width: 100%
			height: 400px
			&:hover
				cursor: pointer
			.video-player-box
				width: 100%
				height: 100%
				.video-js
					width: 100%
					height: 100%
		&:hover
			.info-layer
				transform: translateX(-100%)
				transition: .3s linear all
	@media only screen and (min-width: 1921px)
		.video-player
			.info-layer
				.inner-container
					.video-header
						font-size: 14pt
					.video-subtitle
						font-size: 16pt
					.video-title
						font-size: 18pt
			.video
				width: 100%
				height: 600px
</style>