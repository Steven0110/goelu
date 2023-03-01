<template lang="pug">
	.files-analytics
		loader(position="absolute", background="white", v-show="gettingAnalytics", image="/assets/icons/loading.gif")
		v-row
			v-col(cols="4")
				.section
					.fa-subtitle
						|{{ $t('videos')}}
					.fa-title
						router-link(:to="{path: '/dashboard/file-manager', query: {tab: 'videos'} }")
							|{{$t('uploaded-videos-1')}} #[br(v-if="$vuetify.breakpoint.mdAndDown")] {{$t('uploaded-videos-2')}}
					.fa-quantity
						|{{ filesData.uploadedFiles.videos }}
			v-col(cols="4")
				.section
					.fa-subtitle
						|{{ $t('audios')}}
					.fa-title
						router-link(:to="{path: '/dashboard/file-manager', query: {tab: 'audios'} }")
							|{{$t('uploaded-audios-1')}} #[br(v-if="$vuetify.breakpoint.mdAndDown")] {{$t('uploaded-audios-2')}}
					.fa-quantity
						|{{ filesData.uploadedFiles.audios }}
			v-col(cols="4")
				.section
					.fa-subtitle
						|{{ $t('files')}}
					.fa-title
						router-link(:to="{path: '/dashboard/file-manager', query: {tab: 'files'} }")
							|{{$t('uploaded-files-1')}} #[br(v-if="$vuetify.breakpoint.mdAndDown")] {{$t('uploaded-files-2')}}
					.fa-quantity
						|{{ filesData.uploadedFiles.others }}
		.used-storage
			.total-title
				|{{ $t('used')}}:&nbsp;
			.quantity
				|{{ filesData.usedStorage | sizeGB }} GB
		.total-storage
			.total-title
				|{{ $t('total')}}:&nbsp;
			.quantity()
				|{{ filesData.storageLimit | sizeGB }} GB			
		.storage-bar(:style="filesData.styles")
</template>

<script>
	import Loader from "@/components/misc/Loader.vue"

	export default {
		data() {
			return {
				status: {
					loading: true
				}
			}
		},
		filters: {
			sizeMB: function( value ){
				if( value >= 0 && typeof value == "number" )
					return parseFloat(value / 1000000).toFixed(2)
				else return ""
			},
			sizeGB: function( value ){
				if( value >= 0 && typeof value == "number" )
					return parseFloat(value / 1000000000).toFixed(2)
				else return ""
			},
		},
		computed: {
			isGb: function(){
				if( this.plan && this.plan.name ){
					if(this.plan.name.split(" - ")[1].split(" ")[1]==='MB')
						return false
					else
						return true
				}					
				else
					return true			
			},
			length: function(){
				let css = {}

				css.width = "33%"
				return css
			},
			filesData: function(){
				let files = this.$store.getters.files
				let uploadedFiles = {videos: 0, audios: 0, others: 0}
				let usedStorage = 0
				let storageLimit = 0
				if(this.isMB==='MB')
					storageLimit = (this.planStorage) * 1000 * 1000
				else
					storageLimit = (this.planStorage) * 1000 * 1000 * 1000

				if( files.length > 0)
					this.status.loading = false

				for( let i = 0 ; i < files.length ; i++ ){
					usedStorage += files[ i ].size

					switch( files[ i ].type ){
						case "video":
							uploadedFiles.videos++
							break
						case "audio":
							uploadedFiles.audios++
							break
						case "other":
						default:
							uploadedFiles.others++
							break
					}
				}

				let usedPercentage = usedStorage * 100 / storageLimit
				let data = {
					uploadedFiles: 	uploadedFiles,
					usedStorage: 	usedStorage,
					usedPercentage: Number(parseFloat(usedPercentage).toFixed(2)),
					storageLimit: 	storageLimit
				}
				data.styles = {width: data.usedPercentage + "%"}
				return data
			},
			gettingAnalytics: function(){
				return this.$store.getters.gettingAnalytics
			},
			plan: function() {
				return this.$store.getters.plan || false
			},
			planStorage: function() {
				if( this.plan && this.plan.name )
					return Number(this.plan.name.split(" - ")[1].split(" ")[0])
				else
					return 0
			},
			isMB:function(){
				if( this.plan && this.plan.name )
					return this.plan.name.split(" - ")[1].split(" ")[1]
				else
					return 0
			}
		},
		components: {
			Loader
		}
	}
</script>

<style lang="sass">
	.files-analytics
		background-color: #58acf2
		padding-bottom: 40px
		position: relative
		border-radius: 3px
		.section
			position: relative
			&:before
				content: ''
				position: absolute
				height: 1px
				bottom: 0
				left: -12px
				right: -12px
				background-color: rgba(255, 255, 255, 0.3)
			&:after
				content: ''
				position: absolute
				width: 1px
				height: 80%
				top: 0
				bottom: 0
				right: -15px
				margin-top: auto
				margin-bottom: auto
				background-color: rgba(255, 255, 255, 0.3)
			.fa-title
				font-family: Raleway
				color: white
				text-align: center
				font-size: 11pt
				text-transform: uppercase
				font-weight: 700
				margin-bottom: 5px
				letter-spacing: 1px
				a
					text-decoration: none
					color: white
					&:hover
						text-decoration: underline
			.fa-subtitle
				font-family: Raleway
				color: black
				text-align: center
				font-size: 7pt
				text-transform: uppercase
				letter-spacing: 1px
			.fa-quantity
				font-family: Raleway
				color: white
				text-align: center
				font-weight: 800
				font-size: 30pt
		.used-storage
			padding: 15px
			position: absolute
			bottom: 0
			left: 0
			.total-title
				display: inline-block
				font-family: Raleway
				font-weight: 700
				font-size: 10pt
				color: black
			.quantity
				display: inline-block
				font-family: Raleway
				font-weight: 700
				font-size: 10pt
				color: white

		.total-storage
			padding: 15px
			position: absolute
			bottom: 0
			right: 0
			.total-title
				display: inline-block
				font-family: Raleway
				font-weight: 700
				font-size: 10pt
				color: black
			.quantity
				display: inline-block
				font-family: Raleway
				font-weight: 700
				font-size: 10pt
				color: white
		.storage-bar
			position: absolute
			height: 3px
			bottom: -3px
			left: 0
			width: 0px
			background-color: red
			transition: 1s linear all
	@media only screen and (min-width: 1367px)
		.files-analytics
			.section
				.fa-title
					font-size: 13pt
				.fa-subtitle
					font-size: 9pt
			.used-storage
				.total-title
					font-size: 12pt
				.quantity
					font-size: 12pt

			.total-storage
				.total-title
					font-size: 12pt
				.quantity
					font-size: 12pt
	@media only screen and (min-width: 1921px)
		.files-analytics
			.section
				.fa-title
					font-size: 17pt
				.fa-subtitle
					font-size: 13pt
			.used-storage
				.total-title
					font-size: 16pt
				.quantity
					font-size: 16pt

			.total-storage
				.total-title
					font-size: 16pt
				.quantity
					font-size: 16pt
	@media only screen and (max-width: 640px)
		.files-analytics
			.section
				.fa-title
					font-size: 9pt
				//.fa-subtitle
				//	font-size: 13pt
</style>