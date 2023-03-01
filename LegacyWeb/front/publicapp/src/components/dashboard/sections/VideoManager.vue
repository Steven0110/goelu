<template lang="pug">
	.video-manager-panel
		table.subsection-header.d-none.d-md-block
			tr
				td
					.subsection-header-icon
						img(src="/assets/icons/ic_dvideo_lg.svg")
				td
					.subsection-header-posticon
						img(src="/assets/icons/ic_header_dvideo.svg")
				td
					.subsection-title
						|Videos
				td
					.subsection-description
						|Watch all your videos
		.subsection-header.d-block.d-md-none
			.subsection-header-icon
				img(src="/assets/icons/ic_dvideo_lg.svg")
			.subsection-header-posticon
				img(src="/assets/icons/ic_header_dvideo.svg")
			.subsection-title
				|Videos
			.subsection-description
				|Watch all your videos
		.content

			v-data-table.others-datatable(:headers="videoTableHeaders", :items="videoFiles", :loading="loadingFiles", loading-text="Loading files", no-data-text="No files available")
				template(v-slot:item.imageUsr="{ item }")
					.contact-thumbnail(:style="{backgroundImage:'url('+item.imageUsr+')'}")
				template(v-slot:item.nameUser="{ item }")
					span
						|{{ item.nameUser}}
				template(v-slot:item.description="{ item }")
					.snapshot
						.snapshot-title
							|{{ item.title }}
						.snapshot-description
							|{{ item.description }}
				template(v-slot:item.size="{ item }")
					span
						|{{ item.size | sizeMB }} MB.
				template(v-slot:item.createdAt="{ item }")
					span
						|{{ item.createdAt | moment("DD/MMM/YY HH:MM") }} hrs.
				template(v-slot:item._id="{ item }")
					.others-actions

						v-tooltip(top)
							template(v-slot:activator="{ on }")
								a(:href="item.url", target="_blank")
									v-icon.mr-1(
										v-on="on",
										small)
										|mdi-download
							span
								|Download file
						v-tooltip(top)
							template(v-slot:activator="{ on }")
								router-link(:to="generateVideoURL(item.url)")
									v-icon.mr-1.ml-1(
										small,
										v-on="on",
										alt="View video",
										@click="")
										|mdi-play
							span
								|View video
</template>

<script>
	import Loader from "@/components/misc/Loader.vue"
	export default {
		data() {
			return {
				status: {
					loading: false,
				},
				videoTableHeaders: [
					{ text: "Picture", value: "imageUsr", width: "7%"},
					{ text: "Name", value: "nameUser"},
					{ text: "File", value: "description" },
					{ text: "Title", value: "title", align: "start" },
					{ text: "Date", value: "createdAt" },
					{ text: "Size", value: "size" },
					{ text: "Actions", value: "_id" },
				]
			}
		},
		computed: {
			videoFiles: function(){
				let files = this.$store.getters.files
				let videos = []

				for( let i = 0 ; i < files.length ; i++ )
					if( files[ i ].type == "video" )
						videos.push( files[ i ] )
				return videos
			},
			loadingFiles: function(){
				return this.$store.getters.gettingFiles
			},
		},
		filters: {
			sizeMB: function( value ){
				if( value >= 0 && typeof value == "number" )
					return parseFloat(value / 1000000).toFixed(2)
				else return ""
			}
		},
		methods: {
			generateDocURL: function(url){
				let link = {path: "/dashboard/document-viewer", query: {url: url, returnable: "true"}}
				return link
			},
			generatePdfURL: function(url){
				let link = {path: "/dashboard/pdf-viewer", query: {url: url, returnable: "true"}}
				return link
			},
			generateVideoURL: function(url){
				let link = {path: "/dashboard/video-viewer", query: {url: url, returnable: "true"}}
				return link
			},
			generateAudioURL: function(url){
				let link = {path: "/dashboard/audio-player", query: {url: url, returnable: "true"}}
				return link
			},
		},
		components: {
			Loader
		}
	}
</script>

<style lang="sass">
	.video-manager-panel
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
			background-color: #53608a
			background-size: 100% 100%
			background-repeat: no-repeat
			overflow: hidden
			.subsection-header-icon
				display: inline-block
				width: 60px
				vertical-align: top
				margin-right: 15px
				img
					max-height: 100%
					vertical-align: middle
			.subsection-header-posticon
				position: absolute
				width: 150px
				bottom: -25px
				right: 0
				opacity: 0.3

			.subsection-title
				display: inline-block
				font-family: Raleway
				font-weight: 800
				font-size: 20pt
				text-transform: uppercase
				vertical-align: top
				color: white
				margin-top: 5px
			.subsection-description
				position: relative
				display: inline-block
				font-weight: 800
				font-family: Raleway
				font-size: 12pt
				letter-spacing: 1px
				vertical-align: top
				margin-top: 8px
				padding-left: 30px
				color: white
		.content
			position: relative
			box-shadow: 4px 5px 8px -8px black
			.others-datatable
				.contact-thumbnail
					overflow: hidden
					border-radius: 50%
					width: 30px
					height: 30px
					background-size: cover
					background-position: center
				.snapshot
					position: relative
					padding: 5px
					padding-left: 0PX
					.snapshot-title
						font-family: Raleway
						font-size: 12pt
						font-weight: 600
						margin-bottom: -6px
					.snapshot-description
						font-size: 10pt
						font-weight: 500
						margin-top: -6px

	@media only screen and (min-width: 1921px)
		.video-manager-panel
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt

	@media only screen and (max-width: 768px)
		.video-manager-panel
			padding: 0
			padding-bottom: 55px
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

			.v-data-table
				.v-data-table__wrapper
					&::-webkit-scrollbar-track
						-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
						background-color: rgba(255, 255, 255, 0.2)
					&::-webkit-scrollbar
						width: 10px
						background-color: rgba(255, 255, 255, 0.2)
					&::-webkit-scrollbar-thumb
						background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.44, #53608a),color-stop(0.72, #53608a),color-stop(0.86, #252b3d))
				table
					width: 250%
					overflow-x: scroll
					margin-top: 110px
					thead
						tr
							th
								border-bottom: none !important
								&:first-child
									position: absolute
									top: 55px
									width: calc(100vw - 20px)

									.v-text-field .v-input__slot:before
										display: none
					tbody
						.v-data-table__mobile-row
							display: table-cell !important
							//width: 170px
							text-align: center
							.v-data-table__mobile-row__header
								text-align: center
							.v-data-table__mobile-row__cell
								text-align: center
						tr
							display: table-row
							.v-data-table__mobile-row
								&:nth-last-child(1)
									width: 200px
								&:nth-last-child(2)
									width: 150px
						tr
							&:first-child
								.v-data-table__mobile-row
									&:nth-last-child(2)
										.v-data-table__mobile-row__cell
											min-height: 38px
						tr
							.v-data-table__mobile-row
								.v-data-table__mobile-row__cell
									min-height: 76px
						tr.v-data-table__empty-wrapper
							text-align: left
					tbody
						tr
							width: 100%

							&:not(:first-child)
								.v-data-table__mobile-row__header
									display: none
</style>