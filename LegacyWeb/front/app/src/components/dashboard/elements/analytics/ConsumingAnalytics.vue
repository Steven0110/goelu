<template lang="pug">
	.consuming-analytics

		loader(position="absolute", background="white", v-show="gettingAnalytics", image="/assets/icons/loading.gif")

		.ca-title
			|{{ $t("statistics") }}
		v-row
			v-col(sm="2", cols="12")
				.file-tag
					.tag-icon
						img(src="/assets/icons/ic_audio.svg")
					.tag-name
						|{{ $t("audio") }}
				.file-tag
					.tag-icon
						img(src="/assets/icons/ic_video.svg")
					.tag-name
						|{{ $t("video") }}
				.file-tag
					.tag-icon
						img(src="/assets/icons/ic_other.svg")
					.tag-name
						|{{ $t("others") }}
			v-col(sm="10", cols="12")
				multi-progress-bar(:p1="storage.videos", :p2="storage.audios", :p3="storage.others")

		.buy-storage(@click="select")
			|{{ $t("buy-storage") }}
</template>

<script>
	import MultiProgressBar 	from "@/components/dashboard/elements/analytics/MultiProgressBar.vue"
	import Loader 				from "@/components/misc/Loader.vue"

	export default {
		data() {
			return {
				status: {
					loading: true
				}
			}
		},
		methods:{
			select:function(){
				
				if(this.$route.name == 'm-plan'){					
					this.$root.$emit('goUpgrade')					
				}
				else
					this.$router.push({path: '/dashboard/plan', query: {returnable: "true", from: "plan", tab:"upgrade"}})
								
			}
		},
		filters: {
			sizeMB: function( value ){
				if( value && typeof value == "number" )
					return parseFloat(value / 1000000).toFixed(2)
				else return ""
			},
			sizeGB: function( value ){
				if( value && typeof value == "number" )
					return parseFloat(value / 1000000000).toFixed(2)
				else return ""
			},
		},
		computed: {
			storage: function(){
				let files = this.$store.getters.files
				let storageLimit = (this.$store.getters.plan.storageLimit || 20) * 1000 * 1000 * 1000
				let storage = {videos: 0, audios: 0, others: 0}

				if( files.length > 0 )
					this.status.loading = false

				for( let i = 0 ; i < files.length ; i++ ){
					switch( files[ i ].type ){
						case "video":
							storage.videos += files[ i ].size
							break
						case "audio":
							storage.audios += files[ i ].size
							break
						case "other":
						default:
							storage.others += files[ i ].size
							break
					}
				}

				let videosStorage = storage.videos * 100 / storageLimit
				let audiosStorage = storage.audios * 100 / storageLimit
				let othersStorage = storage.others * 100 / storageLimit

				let data = {
					videos: Number(parseFloat(videosStorage).toFixed(2)),
					audios: Number(parseFloat(audiosStorage).toFixed(2)),
					others: Number(parseFloat(othersStorage).toFixed(2))
				}

				return data
			},
			gettingAnalytics: function(){
				return this.$store.getters.gettingAnalytics
			}
		},
		components: {
			MultiProgressBar,
			Loader
		}
	}
</script>

<style lang="sass">
	.consuming-analytics
		padding: 15px
		background-color: white
		position: relative
		border-radius: 3px
		.ca-title
			font-family: Raleway
			font-size: 10pt
			text-align: center
			color: black
			text-transform: uppercase
			font-weight: 600
		.file-tag
			.tag-icon
				display: inline-block
				position: relative
				width: 15px
				height: 15px
				margin-right: 5px
				img
					position: absolute
					display: block
					bottom: -3px
					max-width: 100%
			.tag-name
				display: inline-block
				font-family: Raleway
				font-size: 9pt
				font-weight: 600
				text-transform: uppercase
				letter-spacing: 1px
		.buy-storage
			position: absolute
			bottom: 0
			right: 0
			color: #2963b4
			font-size: 9pt
			text-transform: uppercase
			transition: 0.2s linear all
			font-weight: 600
			letter-spacing: 1px
			padding-right: 15px
			padding-bottom: 15px
			&:hover
				cursor: pointer
				color: #1c437a
				transition: 0.2s linear all
	@media only screen and (min-width: 1367px)
		.consuming-analytics
			.ca-title
				font-size: 12pt
			.file-tag
				.tag-name
					font-size: 11pt
			.buy-storage
				font-size: 11pt
	@media only screen and (min-width: 1921px)
		.consuming-analytics
			.ca-title
				font-size: 16pt
			.file-tag
				.tag-name
					font-size: 15pt
			.buy-storage
				font-size: 15pt
	@media only screen and (max-width: 960px)
		.consuming-analytics
			.file-tag
				display: inline-block
				width: 33%
				flaot: left
				margin-bottom: 10px
				text-align: center
			.multi-progress-bar
				margin-bottom: 25px
			.buy-storage
				bottom: -10px
</style>