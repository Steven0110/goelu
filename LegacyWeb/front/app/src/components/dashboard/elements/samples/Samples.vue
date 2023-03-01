<template lang="pug">
	.samples-subpanel
		.section-subtitle
			|{{$t('samples-scripts-examples-how')}}

		v-row
			v-col(md="4", cols="12", v-for="video in videos", :key="video.name")
				v-card.video-card.elevation-0
					v-img.main-image(height="300px", :src="video.snapshot")
						v-img.video-overlay(height="100%", src="/assets/images/video-overlay.png", @click="showVideo( video.url )")
					v-card-title
						|{{  $t(video.name) }}
					v-card-text(v-html="$t(video.description)")
					v-card-actions.pb-7
						v-spacer
						v-btn.elevation-0.pl-10.pr-10(tile, color="#325ecf", dark, small, @click="showVideo( video.url )")
							|{{ $t('watch-video') }}
						v-spacer
		v-dialog(:max-width="maxWidth", v-model="videoPlayer.show", content-class="video-dialog" persistent)
			.video-player-container
				
				video-player.video-player-box(
				ref="videoPlayer",
				:playsinline="true",
				:options="options")

				v-btn.elevation-0.video-player-closer(color="red lighten-1", fab, :small="small", :x-small="xsmall", absolute, @click="closeVideo")
					v-icon(color="white")
						|mdi-close


</template>

<script>

	import { videoPlayer } from "vue-video-player"
	import "video.js/dist/video-js.css"

	export default {
		data() {
			return {
				tabs: null,
				videos: [
					{
						snapshot: "/assets/images/samples/goelu_sample_successful_01.jpg",
						url: "/assets/videos/samples/goelu_successful_sample.mp4",
						name: "samples-text-success-name",
						description: "samples-text-success-content"
					}
				],
				videoPlayer: {
					show: false,
					url: null
				}
			}
		},
		methods: {
			showVideo: function( url ) {
				this.videoPlayer.url = url
				this.videoPlayer.show = true
				if(!(typeof this.$refs.videoPlayer === 'undefined')){
					this.$refs.videoPlayer.player.play()
				}					
			},
			closeVideo:function(){								
				this.$refs.videoPlayer.player.pause()				
				this.videoPlayer.show = false
			}
		},
		components: {
			videoPlayer
		},
		computed: {
			options: function(){
				let options = {
					muted: false,
					height: this.$vuetify.breakpoint.height - 200,
					width: 350,
					language: "en",					
					playbackRates: [0.7, 1.0, 1.5, 2.0],
					sources: [{type: "video/mp4", src: this.videoPlayer.url}]
				}

				return options
			},
			maxWidth: function(){

				if(this.$vuetify.breakpoint.width > 960)
					return "70%"
				else
					return "100%"
			},
			small: function(){
				if(this.$vuetify.breakpoint.width > 960)
					return true
				else
					return false
			},
			xsmall: function(){
				if(this.$vuetify.breakpoint.width > 960)
					return false
				else
					return true
			},
		}
	}	
</script>

<style lang="sass">
	.samples-subpanel
		position: relative
		padding: 15px
		padding-bottom: 80px
		background-color: rgba(0, 0, 0, 0.05)
		min-height: 100%
		.section-subtitle
			font-family: Raleway
			letter-spacing: 1px
			padding-top: 15px
			padding-bottom: 10px
			color: black
			font-weight: 700
			text-transform: uppercase
			font-size: 20px
		.subsection-header
			display: block
			position: relative
			width: 100%
			padding: 10px
			padding-bottom: 10px
			background-color: #4c94c7
			background-size: 100% 100%
			background-repeat: no-repeat
			overflow: hidden

			.subsection-header-posticon
				position: absolute
				width: 200px
				bottom: -35px
				right: 0
				opacity: 0.3

			.subsection-header-icon
				display: inline-block
				width: 60px
				vertical-align: top
				img
					max-height: 100%
					vertical-align: middle

			.subsection-title
				display: inline-block
				font-family: Raleway
				font-weight: 800
				font-size: 20pt
				text-transform: uppercase
				vertical-align: top
				padding-left: 15px
				color: white
				letter-spacing: 2px
				margin-top: 5px
			.subsection-description
				position: relative
				display: inline-block
				font-weight: 800
				font-family: Raleway
				font-size: 12pt
				letter-spacing: 1px
				vertical-align: top
				padding-left: 30px
				margin-top: 8px
				color: white
		.content			
			.video-card
				.main-image
					.video-overlay
						transform: translateY(-100%)
						transition: 0.2s linear all
					&:hover
						cursor: pointer
						.video-overlay
							transform: translateY(0%)
							transition: 0.2s linear all

				.v-card__title
					color: #77a8d9
					font-weight: 700
					padding-left: 24px
					padding-right: 24px
				.v-card__text
					text-align: justify
					padding-left: 24px
					padding-right: 24px
	.video-dialog
		overflow: unset !important
		.video-player-container
			position: relative
			.video-player-closer
				top: -15px
				right: -15px
			.video-player-box
				height: 100%
				.video-js
					width: 100% !important

	@media only screen and (min-width: 1905px)
		.samples-subpanel
			.content
	@media only screen and (max-width: 1904px)
		.samples-subpanel
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
	@media only screen and (max-width: 1264px)
		.samples-subpanel
			.subsection-header
	@media only screen and (max-width: 960px)
		.samples-subpanel
			padding: 0
			padding: 15px
			padding-bottom: 50px
			.subsection-header
				padding-left: 90px
				padding-bottom: 15px
				.subsection-description
					display: block
					margin-left: 0
					margin-top: 0
					padding-left: 15px
					font-size: 12pt
				.subsection-header-icon
					position: absolute
					top: 0
					bottom: 0
					margin-top: auto
					margin-bottom: auto
					height: 100%
					left: 10px
					img
						position: absolute
						top: 0
						bottom: 0
						margin-top: auto
						margin-bottom: auto
						height: 60%
						left: 10px
				.subsection-title
					margin-top: 0
					margin-left: 0
					display: block
					font-size: 20pt

				.subsection-header-posticon
					width: 180px

			.video-card
				padding: 15px
				.v-card__title
					padding-left: 0 !important
					padding-right: 0 !important
				.v-card__text
					padding-left: 0 !important
					padding-right: 0 !important
		.video-dialog
			margin: 0 !important
			height: 100vh
			max-height: 100% !important
			.video-player-container
				height: 100vh
				.video-js
					height: 100vh
				.video-player-closer
					top: 10px
					right: 10px
</style>