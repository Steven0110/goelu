<template lang="pug">
	.header
		.relative.desktop
			.logo
				router-link(:to="{path: '/dashboard'}")
					img.img.img-responsive(src="/assets/images/logo.svg")
			.options
				.language-selector
					.valign-parent
						p.valign-child
							span.language-option.english-switcher(@click="setLocale('en')", :class="{active: locale == 'en'}")
								|EN
							span
								|/
							span.language-option.spanish-switcher(@click="setLocale('es')", :class="{active: locale == 'es'}")
								|ES
				//.option
					.valign-parent
						router-link.valign-child(:to="{path: '/dashboard/profile'}")
							|{{ $t("profile") }}
</template>

<script>
	export default {
		methods: {
			setLocale: function(locale){
				localStorage.setItem("locale", locale)
				this.$i18n.locale = locale
			}
		},
		computed: {
			locale: function(){
				return this.$i18n.locale
			}
		}
	}
</script>

<style lang="sass">
	.header
		width: 100%
		height: 9vh
		top: 0
		z-index: 99
		position: fixed
		left: 0
		background-color: #343434
		border-bottom: 1px solid rgba(255, 255, 255, 0.3)
		transition: 0.2s linear all
		.logo
			width: 10%
			position: relative
			display: table
			text-align: center
			float: left
			height: 9vh
			border-right: 1px solid rgba(255, 255, 255, 0.3)
			transition: 0.2s linear all
			a
				padding-top: 4px
				padding-bottom: 4px
				height: 9vh
				display: table-cell
				vertical-align: middle
			img
				display: inline-block
				max-height: 100%
				max-width: 85%
		.options
			float: left
			width: 90%
			height: 9vh
			border-right: 1px solid rgba(255, 255, 255, 0.3)
			transition: 0.2s linear all
			.option
				float: right
				height: 100%
				border: 1px solid rgba(255, 255, 255, 0.3)
				border-bottom: none
				border-right: none
				font-family: Raleway, sans-serif
				font-weight: 700
				font-size: 8pt
				text-transform: uppercase
				transition: 0.3s linear all
				&:hover
					background-color: #9e9e9e
					transition: 0.3s linear all
					a
						transition: 0.3s linear all
						color: #e0e0e0
				&:first-child
					border-right: none
				a
					transition: 0.3s linear all
					color: white
					text-decoration: none
					font-family: Raleway
					padding-left: 25px
					padding-right: 25px
					&:hover
						text-decoration: none

			.language-selector
				float: right
				padding-right: 25px
				padding-left: 25px
				height: 100%
				border: 1px solid rgba(255, 255, 255, 0.3)
				border-bottom: none
				border-right: none
				transition: 0.3s linear all
				font-family: Raleway, sans-serif
				font-weight: 700
				font-size: 8pt
				width: 150px
				color: white
				transition: 0.2s linear all
				width: 120px
				span
					display: inline-block
					color: #bbb
					transition: 0.2s linear all
					&.language-option
						&.active
							color: white
							transition: 0.2s linear all
						&:hover
							cursor: pointer
							color: white
							transition: 0.2s linear all
						&.english-switcher
							margin-right: 4px
						&.spanish-switcher
							margin-left: 4px
</style>