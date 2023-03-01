<template lang="pug">
	.samplesx-panel
		table.subsection-header.d-none.d-md-block
			tr
				td
					.subsection-header-icon
						img(src="/assets/icons/ic_dsamples_lg-01.svg")
				td
					.subsection-header-posticon
						img(src="/assets/icons/ic_header_samples-01.svg")
				td
					.subsection-title
						|{{ $t('samples-header-title') }}
				td
					.subsection-description
						|{{ $t('samples-header-description') }}

		.subsection-header.d-block.d-md-none
			.subsection-header-icon
				img(src="/assets/icons/ic_dsamples_lg-01.svg")
			.subsection-header-posticon
				img(src="/assets/icons/ic_header_samples-01.svg")
			.subsection-title
				|{{ $t('samples-header-title') }}
			.subsection-description
				|{{ $t('samples-header-description') }}

		.content
			v-tabs(v-model="tabs", color="#90b584")
				v-tab(key="samples-tab")
					|{{ $t('samples-header-title') }}
				v-tab(key="scripts-tab")
					|{{ $t('samples-scripts') }}
			v-tabs-items(v-model="tabs", touchless)
				v-tab-item(key="samples-tab")
					samples
				v-tab-item(key="scripts-tab")
					scripts

</template>

<script>

	import Samples 	from "@/components/dashboard/elements/samples/Samples.vue"
	import Scripts 	from "@/components/dashboard/elements/samples/Scripts.vue"

	export default {
		data() {
			return {
				tabs: null,
			}
		},
		methods: {
		},
		components: {
			Samples,
			Scripts
		},
	}	
</script>

<style lang="sass">
	.samplesx-panel
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
			background-color: #379ab3
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
		.samplesx-panel
			.content
	@media only screen and (max-width: 1904px)
		.samplesx-panel
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
	@media only screen and (max-width: 1264px)
		.samplesx-panel
			.subsection-header
	@media only screen and (max-width: 960px)
		.samplesx-panel
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