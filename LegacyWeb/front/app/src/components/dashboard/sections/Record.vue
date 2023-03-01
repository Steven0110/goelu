<template lang="pug">
	.record-panel
		table.subsection-header.d-none.d-md-block
			tr
				td
					.subsection-header-icon
						img(src="/assets/icons/ic_record_lg.svg")
				td
					.subsection-header-posticon
						img(src="/assets/icons/ic_header_record.png")
				td
					.subsection-title
						|{{ $t('record-header-title') }}
				td
					.subsection-description
						|{{ $t('record-header-description') }}
		.subsection-header.d-block.d-sm-none
			.subsection-header-icon
				img(src="/assets/icons/ic_record_lg.svg")
			.subsection-header-posticon
				img(src="/assets/icons/ic_header_record.png")
			.subsection-title
				|{{ $t('record-header-title') }}
			.subsection-description
				|{{ $t('record-header-description') }}
		.content
			loader(position="absolute", background="white", v-show="status.loading", image="/assets/icons/loading.gif")

			v-tabs(v-model="tabs", color="#4699dc")
				v-tab(key="video-tab")
					|Video
				v-tab(key="audio-tab")
					|Audio
			v-tabs-items(v-model="tabs")
				v-tab-item(key="video-tab")
					video-record
				v-tab-item(key="audio-tab")
					audio-record
</template>

<script>
	import Loader from "@/components/misc/Loader.vue"
	import VideoRecord from "@/components/VideoJSRecord.vue"
	import AudioRecord from "@/components/AudioJSRecord.vue"

	export default {
		data() {
			return {
				tabs: null,
				status: {
					loading: false,
					saving: false
				},
			}
		},
		activated(){
			console.log( this.$route.query.tab)
			if( this.$route.query.tab ){
				if( this.$route.query.tab == 'audio')
					this.tabs = 1
				else
					this.tabs = 0
			}
		},
		computed: {
		},
		filters: {
			sizeMB: function( value ){
				if( value && typeof value == "number" )
					return parseFloat(value / 1000000).toFixed(2)
				else return ""
			}
		},
		methods: {
		},
		components: {
			VideoRecord,
			AudioRecord,
			Loader,
		}
	}
</script>

<style lang="sass">
	.record-panel
		position: relative
		padding: 15px
		padding-bottom: 80px
		background-color: #f2f2f2
		min-height: 100%
		.subsection-header
			display: block
			position: relative
			width: 100%
			padding: 10px
			background-color: #516189
			background-size: 100% 100%
			background-repeat: no-repeat
			.subsection-header-icon
				display: inline-block
				width: 60px
				vertical-align: top
				img
					max-height: 60px
					vertical-align: middle
			.subsection-header-posticon
				position: absolute
				width: 250px
				top: 10px
				right: -100px
				opacity: 0.3

			.subsection-title
				display: inline-block
				font-family: Raleway
				font-weight: 800
				font-size: 20pt
				text-transform: uppercase
				vertical-align: top
				padding-left: 15px
				color: white
				margin-top: 5px
			.subsection-description
				position: relative
				display: inline-block
				font-weight: 800
				font-family: Raleway
				font-size: 12pt
				letter-spacing: 1px
				padding-left: 30px
				vertical-align: top
				margin-top: 8px
				color: white
		.v-tabs
			.v-tab
				max-width: none !important
				width: 50%
				font-family: Raleway
				font-weight: 600
				&.v-tab--active
					box-shadow: 0px 0px 15px -10px black
		.content
			position: relative
	@media only screen and (min-width: 1921px)
		.record-panel
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
			.v-tabs
				border: 1px solid rgba(0, 0, 0, 0.1)
				.v-tab
					font-size: 17pt
			input,textarea
				font-size: 16pt
			label
				font-size: 16pt
	@media only screen and (max-width: 768px)
		.record-panel
			padding: 0
			padding-bottom: 50px
			.subsection-header
				padding-left: 90px
				padding-bottom: 15px
				.subsection-description
					display: block
					margin-left: 0
					margin-top: 0
					padding-left: 0
				.subsection-header-icon
					position: absolute
					top: 0
					bottom: 0
					margin-top: auto
					margin-bottom: auto
					height: 75%
					left: 10px
				.subsection-title
					margin-top: 0
					margin-left: 0
					display: block
					padding-left: 0
</style>