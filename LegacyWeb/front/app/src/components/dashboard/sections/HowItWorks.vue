<template lang="pug">
	.hiw-panel
		table.subsection-header.d-none.d-md-block
			tr
				td
					.subsection-header-icon
						img(src="/assets/icons/ic_dtutorial_lg-01.svg")
				td
					.subsection-header-posticon
						img(src="/assets/icons/ic_header_tutorial-01.svg")
				td
					.subsection-title
						|{{ $t('m-hiw') }}
				td
					.subsection-description
						|Learn how to use the administrator panel

		.subsection-header.d-block.d-md-none
			.subsection-header-icon
				img(src="/assets/icons/ic_dtutorial_lg-01.svg")
			.subsection-header-posticon
				img(src="/assets/icons/ic_header_tutorial-01.svg")
			.subsection-title
				|{{ $t('m-hiw') }}
			.subsection-description
				|Learn how to use the administrator panel

		.content

			.section-subtitle
				|How it works videos

			v-row
				v-col(md="4", cols="12", v-for="video in videos", :key="video.name")
					v-card.video-card.elevation-0
						v-img.main-image(height="300px", :src="video.snapshot")
							v-img.video-overlay(height="100%", src="/assets/images/video-overlay.png", @click="showVideo( video.url )")
						v-card-title
							|{{ video.name }}
						v-card-text
							|{{ video.description }}
						v-card-actions.pb-7
							v-spacer
							v-btn.elevation-0.pl-10.pr-10(tile, color="#325ecf", dark, small, @click="showVideo( video.url )")
								|Watch video
							v-spacer
		v-dialog(max-width="70%", v-model="videoPlayer.show", content-class="video-dialog")
			.video-player-container
				
				video-player.video-player-box(
				ref="videoPlayer",
				:playsinline="true",
				:options="options")

				v-btn.video-player-closer(color="red lighten-1", fab, small, absolute, @click="videoPlayer.show = false")
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
						snapshot: "/assets/images/pic1.png",
						url: "/assets/small.mp4",
						name: "Learn how to upload files",
						description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos neque laboriosam, aliquid quas rerum, nesciunt quibusdam vel voluptas sapiente corporis cumque. Commodi vel illo, impedit saepe aliquid magni distinctio quidem!"
					},
					{
						snapshot: "/assets/images/pic2.png",
						url: "/assets/small.mp4",
						name: "Learn how to record videos and audios",
						description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos neque laboriosam, aliquid quas rerum, nesciunt quibusdam vel voluptas sapiente corporis cumque. Commodi vel illo, impedit saepe aliquid magni distinctio quidem!"
					},
					{
						snapshot: "/assets/images/pic3.png",
						url: "/assets/small.mp4",
						name: "Learn how to manage your files",
						description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos neque laboriosam, aliquid quas rerum, nesciunt quibusdam vel voluptas sapiente corporis cumque. Commodi vel illo, impedit saepe aliquid magni distinctio quidem!"
					},
					{
						snapshot: "/assets/images/pic4.png",
						url: "/assets/small.mp4",
						name: "Learn how to be cool",
						description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos neque laboriosam, aliquid quas rerum, nesciunt quibusdam vel voluptas sapiente corporis cumque. Commodi vel illo, impedit saepe aliquid magni distinctio quidem!"
					},
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
			}
		}
	}	
</script>

<style lang="sass">
	.hiw-panel
		position: relative
		padding: 15px
		padding-bottom: 80px
		background-color: rgba(0, 0, 0, 0.05)
		min-height: 100%
		.subsection-header
			display: block
			position: relative
			width: 100%
			padding: 10px
			padding-bottom: 10px
			background-color: #a8595f
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
			.section-subtitle
				font-family: Raleway
				letter-spacing: 1px
				padding-top: 15px
				padding-bottom: 10px
				color: black
				font-weight: 700
				text-transform: uppercase
				font-size: 20px
			.video-card
				.main-image
					.video-overlay
						transform: translateY(0%)
						transition: 0.2s linear all
					&:hover
						cursor: pointer

				.v-card__title
					color: #77a8d9
					font-weight: 699
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
		.hiw-panel
			.content
	@media only screen and (max-width: 1904px)
		.hiw-panel
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
	@media only screen and (max-width: 1264px)
		.hiw-panel
			.subsection-header
	@media only screen and (max-width: 960px)
		.hiw-panel
			padding: 0
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
			.content
				padding: 15px
</style>