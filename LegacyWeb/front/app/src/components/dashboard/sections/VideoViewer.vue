<template lang="pug">
	.video-viewer
		video-player.video-player-box(
			ref="videoPlayerfiles",
			:playsinline="true",
			:options="options")
</template>

<script>
	import { videoPlayer } from "vue-video-player"
	import "video.js/dist/video-js.css"

	export default {
		data(){
			return{
				url: null
			}
		},
        methods:{
            
        },
		computed: {
			options: function(){				
				
				let options = {
					muted: false,
					language: "en",
					autoplay:false,
					playbackRates: [0.7, 1.0, 1.5, 2.0],
				}

				if( this.$route.query.url )
					this.url = this.$route.query.url
				
				let encodedURL = this.url

				options.sources = [{src: encodedURL, type: "video/mp4"}]
				
				return options
			}
		},
		mounted(){
			
		},
		components: {
			"video-player": videoPlayer
		}
	}
</script>

<style lang="sass">
	.video-viewer
		height: 100%
		padding: 25px
		padding-bottom: 70px
		background-color: rgba(0, 0, 0, 0.05)
		min-height: 100%
		.video-player-box
			height: 100%
			.video-js
				width: 100%
				height: 100%
</style>