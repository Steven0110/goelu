<template lang="pug">
	.tutorials-panel
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
						|{{ $t('tutorial-header-title') }}
				td
					.subsection-description
						|{{ $t('tutorial-header-description') }}

		.subsection-header.d-block.d-md-none
			.subsection-header-icon
				img(src="/assets/icons/ic_dtutorial_lg-01.svg")
			.subsection-header-posticon
				img(src="/assets/icons/ic_header_tutorial-01.svg")
			.subsection-title
				|{{ $t('tutorial-header-title') }}
			.subsection-description
				|{{ $t('tutorial-header-description') }}

		.content
			.samples-subpanel
				v-row
					v-col(md="4", cols="12", v-for="video in videos", :key="video.name")
						v-card.video-card.elevation-0
							v-img.main-image(height="300px", :src="video.snapshot")
								v-img.video-overlay(height="100%", src="/assets/images/video-overlay.png", @click="showVideo( video.url )")
							v-card-title
								|{{ $t(video.name) }}
							v-card-text(v-html="$t(video.description)")
							v-card-actions.pb-7
								v-spacer
								v-btn.elevation-0.pl-10.pr-10(tile, color="#325ecf", dark, small, @click="showVideo( video.url )")
									|{{ $t('watch-video') }}
								v-spacer
				v-dialog(:max-width="maxWidth", v-model="videoPlayer.show", content-class="video-dialog", persistent)
					.video-player-container
						
						video-player.video-player-box(
						ref="videoPlayer",
						:playsinline="true",
						:options="options"
						@statechanged="playerStateChanged($event)"
						)

						v-btn.elevation-0.video-player-closer(color="red lighten-1", fab, :small="small", :x-small="xsmall", absolute, @click="closeVideo")
							v-icon(color="white")
								|mdi-close

</template>

<script>	
	import { videoPlayer } from "vue-video-player"
	import '@videojs/themes/dist/forest/index.css';

	export default {
		data() {
			return {
				tabs: null,
				playerT: null,
				videos: [
					{
						snapshot: "/assets/images/tutorials/goelu_tutorial_subscribe.jpg",
						url: "/assets/videos/tutorials/00Suscribe.mp4",
						name: 'tutorial-text-subscribe-name',
						description: 'tutorial-text-subscribe-content'
					},
					{
						snapshot: "/assets/images/tutorials/goelu_tutorial_dashboard.jpg",
						url: "/assets/videos/tutorials/02Dashboard.mp4",
						name: "tutorial-text-dashboard-name",
						description: "tutorial-text-dashboard-content"
					},
					{
						snapshot: "/assets/images/tutorials/goelu_tutorial_login_admin.jpg",
						url: "/assets/videos/tutorials/03Login.mp4",
						name: "tutorial-text-login-name",
						description: "tutorial-text-login-content"
					},
					{
						snapshot: "/assets/images/tutorials/goelu_tutorial_profile.jpg",
						url: "/assets/videos/tutorials/03Profile.mp4",
						name: "tutorial-text-profile-name",
						description: "tutorial-text-profile-content"
					},					
					{
						snapshot: "/assets/images/tutorials/goelu_tutorial_file_manager.jpg",
						url: "/assets/videos/tutorials/04FileManager.mp4",
						name: "tutorial-text-filemaneger-name",
						description: 'tutorial-text-filemaneger-content'
					},					
					{
						snapshot: "/assets/images/tutorials/goelu_tutorial_record_video.jpg",
						url: "/assets/videos/tutorials/06RecordVideo.mp4",
						name: "tutorial-text-recordvideo-name",
						description: "tutorial-text-recordvideo-content"
					},					
					{
						snapshot: "/assets/images/tutorials/portadas_tutoriales_record_audio.jpg",
						url: "/assets/videos/tutorials/07RecordAudio.mp4",
						name: "tutorial-text-recordaudio-name",
						description: "tutorial-text-recordaudio-content"
					},					
					{
						snapshot: "/assets/images/tutorials/goelu_tutorial_upload.jpg",
						url: "/assets/videos/tutorials/08UploadFiles.mp4",
						name: "tutorial-text-uploadfile-name",
						description: "tutorial-text-uploadfile-content"
					},					
					{
						snapshot: "/assets/images/tutorials/portadas_tutoriales_samples.jpg",
						url: "/assets/videos/tutorials/09SamplesandScripts.mp4",
						name: "tutorial-text-samples-name",
						description: "tutorial-text-samples-content"
					},					
					{
						snapshot: "/assets/images/tutorials/portadas_tutoriales_groupscontacts.jpg",
						url: "/assets/videos/tutorials/11ContactsandGroups.mp4",
						name: "tutorial-text-contacts-name",
						description: "tutorial-text-contacts-content"
					},					
					{
						snapshot: "/assets/images/tutorials/goelu_tutorial_topics.jpg",
						url: "/assets/videos/tutorials/10Topics.mp4",
						name: "tutorial-text-topics-name",
						description: "tutorial-text-topics-content"
					},					
					{
						snapshot: "/assets/images/tutorials/portadas_tutoriales_plan.jpg",
						url: "/assets/videos/tutorials/12Plan.mp4",
						name: "tutorial-text-plan-name",
						description: "tutorial-text-plan-content"
					},					
					{
						snapshot: "/assets/images/tutorials/portadas_tutoriales_tutorials.jpg",
						url: "/assets/videos/tutorials/15Tutorials.mp4",
						name: "tutorial-text-tutorials-name",
						description: "tutorial-text-tutorials-content"
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
				if(!(this.$refs.videoPlayer===undefined))
					if(this.playerT===this.$refs.videoPlayer.player)
						this.$refs.videoPlayer.player.play()
						//this.$refs.videoPlayer.player.currentTime(0)
			},
			 playerStateChanged(playerCurrentState) {
				 if(playerCurrentState.canplay)
         			this.$refs.videoPlayer.player.play()         		
      		},
			closeVideo(){							
				this.$refs.videoPlayer.player.pause()			
				this.playerT=this.$refs.videoPlayer.player
				this.videoPlayer.show = false
			}
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
		},
		components: {			
			videoPlayer
		},
	}	
</script>

<style lang="sass">
	.tutorials-panel
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
			background-color: #b06464
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
			.v-tabs
				.v-tab
					max-width: none !important
					width: 50%
					font-weight: 600
					&.v-tab--active
						box-shadow: 0px 0px 15px -10px black

	@media only screen and (min-width: 1905px)
		.tutorials-panel
			.content
	@media only screen and (max-width: 1904px)
		.tutorials-panel
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
	@media only screen and (max-width: 1264px)
		.tutorials-panel
			.subsection-header
	@media only screen and (max-width: 960px)
		.tutorials-panel
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
				padding: 0
</style>