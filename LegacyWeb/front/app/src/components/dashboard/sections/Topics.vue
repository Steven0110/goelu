<template lang="pug">
	.categories-panel
		table.subsection-header.d-none.d-md-block
			tr
				td
					.subsection-header-icon
						img(src="/assets/icons/ic_categories_lg.svg")
				td
					.subsection-header-posticon
						img(src="/assets/icons/ic_header_categories.svg")
				td
					.subsection-title
						|{{ $t('topics-header-title') }}
				td
					.subsection-description
						|{{ $t('topics-header-description') }}

		.subsection-header.d-block.d-md-none
			.subsection-header-icon
				img(src="/assets/icons/ic_categories_lg.svg")
			.subsection-header-posticon
				img(src="/assets/icons/ic_header_categories.svg")
			.subsection-title
				|{{ $t('topics-header-title') }}
			.subsection-description
				|{{ $t('topics-header-description') }}
		.content
			loader(position="absolute", background="white", v-show="status.loading", image="/assets/icons/loading.gif")
			
			topics
</template>

<script>
	import Topics 		from "@/components/dashboard/elements/topics/Topics.vue"
	import Loader 		from "@/components/misc/Loader.vue"

	export default {
		data(){
			return {
				tabs: null,
				status: {
					loading: false
				}
			}
		},
		activated() {
			if( this.$route.query.newCategory ){
				this.tabs = 1
			}
		},
		components: {
			Topics,
			Loader,
		}
	}
</script>

<style lang="sass">
	.categories-panel
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
			background-color: #48c3cc
			background-size: 100% 100%
			background-repeat: no-repeat
			overflow: hidden

			.subsection-header-posticon
				position: absolute
				width: 100px
				bottom: -25px
				right: 25px
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
				color: white
				letter-spacing: 2px
				padding-left: 10px
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
		.v-tabs
			.v-tab
				max-width: none !important
				width: 50%
				font-family: Raleway
				font-weight: 800
				&.v-tab--active
					box-shadow: 0px 0px 15px -10px black
	@media only screen and (min-width: 1367px)
		.categories-panel
			.v-tabs
				border: 1px solid rgba(0, 0, 0, 0.1)
				.v-tab
					font-size: 14pt
	@media only screen and (min-width: 1921px)
		.categories-panel
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
			.v-tabs
				.v-tab
					font-size: 18pt
	@media only screen and (max-width: 768px)
		.categories-panel
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
					height: 70%
					left: 10px
					img
						height: 100%
				.subsection-title
					margin-top: 0
					margin-left: 0
					display: block
					padding-left: 0

</style>